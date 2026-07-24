import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useActionStyles } from '../../hook/useThemeStyles';

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const CellDetailsModal = ({
    isVisible,
    onCancel,
    onAction,
    title,
    initialActions = [],
}) => {
    const localStyles = useActionStyles();
    const theme = useSelector((state) => state.theme.theme);

    const [entries, setEntries] = useState([]);
    const [inputText, setInputText] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Reset to a clean slate every time the modal is opened, seeding with
    // whatever was already saved for this cell (if anything).
    useEffect(() => {
        if (isVisible) {
            setEntries(
                initialActions.map((text) =>
                    typeof text === 'string' ? { id: makeId(), text } : text
                )
            );
            setInputText('');
            setEditingId(null);
        }
    }, [isVisible]);

    const resetAndCancel = () => {
        setInputText('');
        setEditingId(null);
        onCancel?.();
    };

    const handleSubmit = () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        if (editingId) {
            setEntries((prev) =>
                prev.map((entry) =>
                    entry.id === editingId ? { ...entry, text: trimmed } : entry
                )
            );
            setEditingId(null);
        } else {
            setEntries((prev) => [...prev, { id: makeId(), text: trimmed }]);
        }
        setInputText('');
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
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.5}
            avoidKeyboard
        >
            <View style={[localStyles.card, { backgroundColor: theme.background }]}>
                <Text style={[localStyles.title, { color: theme.primary }]}>
                    {title}
                </Text>

                <Text style={[localStyles.sectionLabel, { color: theme.text }]}>
                    What I did today
                </Text>
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
        </Modal>
    );
};


export default CellDetailsModal;