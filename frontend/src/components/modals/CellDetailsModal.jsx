import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useActionStyles } from '../../hook/useThemeStyles';
import { addActivity, getActivities } from '../../API/challenge/activitiesApi';
import { ActivityIndicator } from 'react-native';


const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const CellDetailsModal = ({
    isVisible,
    onCancel,
    onAction,
    dayNumber,
    title,
    initialActions = [],
}) => {
    const localStyles = useActionStyles();
    const theme = useSelector((state) => state.theme.theme);

    const [entries, setEntries] = useState([]);
    const [inputText, setInputText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const gridId = useSelector((state) => state.app.gridId);

    // Reset to a clean slate every time the modal is opened, seeding with
    // whatever was already saved for this cell (if anything).
    useEffect(() => {
        if (!isVisible || !gridId || !dayNumber) return;

        let isMounted = true;

        // 1. Instant Cache/Local Hydration (Zero flicker)
        const normalizedInitial = initialActions.map((item) =>
            typeof item === 'string' ? { id: makeId(), text: item } : item
        );
        setEntries(normalizedInitial);
        setInputText('');
        setEditingId(null);

        // 2. Fetch fresh backend activities
        const fetchServerActivities = async () => {
            setLoading(true);
            try {
                const res = await getActivities(gridId, dayNumber);
                const serverData = res?.data || []; // Adjust based on your ApiResponse structure

                if (!isMounted) return;

                // 3. Normalize & Deduplicate / Merge
                setEntries((prev) => {
                    const serverEntries = serverData.map((act) => ({
                        id: act.id,
                        text: act.title,
                    }));

                    // Keep any purely local/optimistic items created in this session
                    // and merge with authoritative server records
                    const serverIds = new Set(serverEntries.map((e) => e.id));
                    const unsyncedLocals = prev.filter(
                        (local) => typeof local.id === 'string' && local.id.startsWith('temp_') && !serverIds.has(local.id)
                    );

                    return [...serverEntries, ...unsyncedLocals];
                });
            } catch (err) {
                console.error("Failed to fetch fresh day activities:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchServerActivities();

        return () => {
            isMounted = false; // Prevents state updates if user closes modal mid-flight
        };
    }, [isVisible, gridId, dayNumber]);

    const resetAndCancel = () => {
        setInputText('');
        setEditingId(null);
        onCancel?.();
    };

    const handleSubmit = async () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        // Reset input immediately for snappy UI feel
        setInputText('');

        if (editingId) {
            // 1. Capture snapshot for rollback
            const previousEntries = [...entries];
            const targetId = editingId;
            setEditingId(null);

            // 2. Optimistic update
            setEntries((prev) =>
                prev.map((entry) => (entry.id === targetId ? { ...entry, text: trimmed } : entry))
            );

            // 3. Sync edit with backend
            try {
                const response = await updateActivity(targetId, trimmed); // Use update endpoint
                console.log("Response in if: ", response);
            } catch (err) {
                console.error("Failed to update activity:", err);
                setEntries(previousEntries); // Rollback on failure
            }
        } else {
            // 1. Generate temp ID and optimistically add
            const tempId = makeId();
            const newEntry = { id: tempId, text: trimmed };
            setEntries((prev) => [...prev, newEntry]);

            // 2. Sync add with backend & replace temp ID with server ID
            try {
                const response = await addActivity(gridId, trimmed);
                console.log("Response in else: ", response);
                if (response?.id) {
                    setEntries((prev) =>
                        prev.map((entry) => (entry.id === tempId ? { ...entry, id: response.id } : entry))
                    );
                }
            } catch (err) {
                console.error("Failed to add activity:", err);
                setEntries((prev) => prev.filter((entry) => entry.id !== tempId)); // Rollback on failure
            }
        }
    };

    const handleEditPress = (entry) => {
        setEditingId(entry.id);
        setInputText(entry.text);
    };

    const handleDelete = (id) => {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setInputText('');
        }
    };

    const handleSave = () => {
        onAction?.(entries.map((entry) => entry.text));
        resetAndCancel();
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={resetAndCancel}
            onBackButtonPress={resetAndCancel}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropOpacity={0}
            avoidKeyboard
            useNativeDriver
            hideModalContentWhileAnimating={false}
        >
            <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                <Text style={[localStyles.title, { color: theme.primary }]}>
                    {title}
                </Text>

                <Text style={[localStyles.sectionLabel, { color: theme.text }]}>
                    What I did today
                </Text>

                {
                    loading ? (
                        <Text style={[localStyles.sectionLabel, { color: theme.border }]}>
                            Loading...
                        </Text>
                    ) : (
                        <View style={localStyles.chipsWrap}>
                            {entries.length === 0 ? (
                                <Text style={[localStyles.emptyText, { color: theme.textMuted }]}>
                                    Nothing added yet
                                </Text>
                            ) : (
                                entries.map((entry) => (
                                    <Pressable
                                        key={entry.id}
                                        onPress={() => handleEditPress(entry)}
                                        style={[
                                            localStyles.chip,
                                            { backgroundColor: theme.primary },
                                            editingId === entry.id && localStyles.chipEditing,
                                        ]}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={localStyles.chipText}
                                        >
                                            {entry.text}
                                        </Text>
                                        <Pressable
                                            onPress={() => handleDelete(entry.id)}
                                            hitSlop={8}
                                            style={localStyles.chipCancelBtn}
                                        >
                                            <Ionicons name="close" size={14} color="#fff" />
                                        </Pressable>
                                    </Pressable>
                                ))
                            )}
                        </View>
                    )
                }



                <View style={localStyles.inputRow}>
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Add what you did today..."
                        placeholderTextColor="#999"
                        style={localStyles.input}
                        onSubmitEditing={handleSubmit}
                        returnKeyType="done"
                        blurOnSubmit={false}
                    />
                    <Pressable
                        onPress={handleSubmit}
                        style={[localStyles.addBtn, { backgroundColor: theme.primary }]}
                    >
                        <Ionicons
                            name={editingId ? 'checkmark' : 'add'}
                            size={20}
                            color="#fff"
                        />
                    </Pressable>
                </View>

                <View style={localStyles.actionsRow}>
                    <Pressable onPress={resetAndCancel} style={localStyles.cancelBtn}>
                        <Text style={{ color: theme.text }}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        onPress={handleSave}
                        style={[localStyles.saveBtn, { backgroundColor: theme.primary }]}
                    >
                        <Text style={localStyles.saveBtnText}>Save</Text>
                    </Pressable>
                </View>
            </View>
        </Modal >
    );
};


export default CellDetailsModal;