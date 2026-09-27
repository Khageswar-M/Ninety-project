import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import {
    addActivity,
    deleteActivity,
    getActivities,
    updateActivity,
} from '../../API/challenge/activitiesApi';
import { useActionStyles } from '../../hook/useThemeStyles';

// Temp IDs are always prefixed so we can reliably tell "not yet persisted"
// entries apart from real database IDs anywhere in the component.
const TEMP_PREFIX = 'temp_';
const makeTempId = () => `${TEMP_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const isTempId = (id) => typeof id === 'string' && id.startsWith(TEMP_PREFIX);

const CellDetailsModal = ({
    isVisible,
    onCancel,
    onAction,
    dayNumber,
    title,
    initialActions = [],
    currentDay,
    actionBoard,
    setActionBoard
}) => {
    const localStyles = useActionStyles();
    const theme = useSelector((state) => state.theme.theme);

    const [entries, setEntries] = useState([]);
    const [inputText, setInputText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const gridId = useSelector((state) => state.app.gridId);

    const isSameCurrentDayAndDayNumber = (currentDay === dayNumber);

    // Reset to a clean slate every time the modal is opened, seeding with
    // whatever was already saved for this cell (if anything).
    useEffect(() => {
        if (!isVisible || !gridId || !dayNumber) return;

        let isMounted = true;

        // 1. Instant Cache/Local Hydration (Zero flicker)
        const normalizedInitial = initialActions.map((item) =>
            typeof item === 'string' ? { id: makeTempId(), text: item, pending: false } : item
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
                        pending: false,
                    }));

                    // Keep any purely local/optimistic items still being created in
                    // this session (never overwrite/duplicate what the server knows about)
                    const serverIds = new Set(serverEntries.map((e) => e.id));
                    const unsyncedLocals = prev.filter(
                        (local) => isTempId(local.id) && !serverIds.has(local.id)
                    );

                    return [...serverEntries, ...unsyncedLocals];
                });
            } catch (err) {
                console.error('Failed to fetch fresh day activities:', err);
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

    const markCurrentDayCompleted = useCallback(() => {
        if (!Number.isInteger(currentDay) || currentDay < 1) {
            return;
        }

        // currentDay is 1-indexed,
        // but the board row/column calculation is 0-indexed.
        const cellIndex = currentDay - 1;

        const rowIndex = Math.floor(cellIndex / 10);
        const colIndex = cellIndex % 10;

        setActionBoard(prevBoard => {
            if (
                !Array.isArray(prevBoard) ||
                !Array.isArray(prevBoard[rowIndex])
            ) {
                return prevBoard;
            }

            // Already completed — no state update needed.
            if (prevBoard[rowIndex][colIndex] === true) {
                return prevBoard;
            }

            const updatedBoard = prevBoard.map(row => [...row]);

            updatedBoard[rowIndex][colIndex] = true;

            return updatedBoard;
        });
    }, [currentDay, setActionBoard]);

    const handleSubmit = async () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        // Reset input immediately for snappy UI feel
        setInputText('');

        if (editingId) {
            // Editing should never be reachable with a temp id (handleEditPress
            // guards against it), but double-check here as a safety net.
            if (isTempId(editingId)) {
                setEditingId(null);
                return;
            }

            // 1. Capture snapshot for rollback
            const previousEntries = [...entries];
            const targetId = editingId;
            console.log("Target update id: ", targetId);
            setEditingId(null);

            // 2. Optimistic update
            setEntries((prev) =>
                prev.map((entry) => (entry.id === targetId ? { ...entry, text: trimmed } : entry))
            );

            // 3. Sync edit with backend
            try {
                const response = await updateActivity(targetId, trimmed);
                // { success, message, data: { id, dayNumber, title, createdAt, updatedAt }, timestamp }
                if (!response?.success) {
                    throw new Error(response?.message || 'Update did not succeed');
                }
                // Reconcile with the authoritative title from the server (e.g. if
                // it got trimmed/normalized server-side).
                const updated = response.data;
                if (updated?.title) {
                    setEntries((prev) =>
                        prev.map((entry) =>
                            entry.id === targetId ? { ...entry, text: updated.title } : entry
                        )
                    );
                }

                // then update the grid locally
                markCurrentDayCompleted();

            } catch (err) {
                console.error('Failed to update activity:', err);
                setEntries(previousEntries); // Rollback on failure
            }
        } else {
            // 1. Generate a clearly-marked temp ID and optimistically add,
            // flagged as "pending" so edit/delete are disabled on it until
            // the backend confirms it exists.
            const tempId = makeTempId();
            const newEntry = { id: tempId, text: trimmed, pending: true };
            setEntries((prev) => [...prev, newEntry]);

            // 2. Sync add with backend & replace temp ID with the real server ID
            try {
                const response = await addActivity(gridId, trimmed);
                // addActivity is wrapped the same way getActivities is:
                // { data: { id, title, ... }, message, success, timestamp }
                const created = response?.data;
                if (created?.id) {
                    setEntries((prev) =>
                        prev.map((entry) =>
                            entry.id === tempId
                                ? { ...entry, id: created.id, text: created.title ?? entry.text, pending: false }
                                : entry
                        )
                    );
                } else {
                    // No usable ID came back — we can't safely treat this as
                    // persisted, so drop the optimistic entry.
                    console.error('addActivity succeeded without a valid id in the response');
                    setEntries((prev) => prev.filter((entry) => entry.id !== tempId));
                }
            } catch (err) {
                console.error('Failed to add activity:', err);
                // 7. Create failed -> remove the temporary activity from the UI.
                setEntries((prev) => prev.filter((entry) => entry.id !== tempId));
            }
        }
    };



    const handleEditPress = (entry) => {
        // 4. Never allow a temp/pending entry to become the thing being edited.
        if (entry.pending || isTempId(entry.id)) return;
        setEditingId(entry.id);
        setInputText(entry.text);
    };

    const handleDelete = async (id) => {
        const target = entries.find((entry) => entry.id === id);

        // 5. Never send a temp ID to the backend — it doesn't exist there yet.
        if (!target || target.pending || isTempId(id)) return;

        // 1. Capture snapshot for rollback
        const previousEntries = [...entries];

        // 2. Optimistic removal
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setInputText('');
        }

        // 3. Sync delete with backend
        try {
            const response = await deleteActivity(id);
            // { success, message, data: null, timestamp } — no id comes back,
            // just confirm it actually succeeded before letting the optimistic
            // removal stand.
            if (!response?.success) {
                throw new Error(response?.message || 'Delete did not succeed');
            }
        } catch (err) {
            console.error('Failed to delete activity:', err);
            setEntries(previousEntries); // Rollback on failure
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={resetAndCancel}
            onBackButtonPress={resetAndCancel}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropOpacity={0.5}
            avoidKeyboard
            useNativeDriver={false}
            hideModalContentWhileAnimating={false}
        >
            <View style={[localStyles.card, { backgroundColor: theme.cellModalBackground }]}>
                <Text style={[localStyles.title, { color: theme.light }]}>
                    {title}
                </Text>

                <Text style={[localStyles.sectionLabel, { color: theme.text }]}>
                    Productivity
                </Text>

                {
                    loading ? (
                        <View style={{
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            gap: 5
                        }}>
                            <ActivityIndicator size={20} color={theme.text} />
                            <Text style={[localStyles.sectionLabel, { color: theme.text }]}>
                                Loading...
                            </Text>
                        </View>
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
                                        onPress={() => isSameCurrentDayAndDayNumber && handleEditPress(entry)}
                                        disabled={entry.pending}
                                        style={[
                                            localStyles.chip,
                                            { backgroundColor: theme.primary },
                                            editingId === entry.id && localStyles.chipEditing,
                                            entry.pending && { opacity: 0.5 },
                                        ]}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={localStyles.chipText}
                                        >
                                            {entry.text}
                                        </Text>
                                        {isSameCurrentDayAndDayNumber && (entry.pending ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#fff"
                                                style={localStyles.chipCancelBtn}
                                            />
                                        ) : (
                                            <Pressable
                                                onPress={() => handleDelete(entry.id)}
                                                hitSlop={8}
                                                style={localStyles.chipCancelBtn}
                                            >
                                                <Ionicons name="close" size={14} color="#fff" />
                                            </Pressable>
                                        ))}
                                    </Pressable>
                                ))
                            )}
                        </View>
                    )
                }

                {
                    isSameCurrentDayAndDayNumber && (
                        <View style={localStyles.inputRow}>
                            <TextInput
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Add your productivity"
                                placeholderTextColor="#999"
                                style={localStyles.input}
                                onSubmitEditing={handleSubmit}
                                selectionColor={theme.light}
                                returnKeyType="done"
                                blurOnSubmit={false}
                                maxLength={50}
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

                    )
                }

                <View style={localStyles.actionsRow}>
                    <Pressable onPress={resetAndCancel} style={localStyles.cancelBtn}>
                        <Text style={{ color: theme.text }}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal >
    );
};

export default CellDetailsModal;