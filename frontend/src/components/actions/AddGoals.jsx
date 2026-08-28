import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
// STATES
import { useCallback, useEffect, useState } from 'react';

// COMPONENT
import GoalTag from '../common/GoalTag';

// HOOKS
import { useActionStyles } from '../../hook/useThemeStyles'

// ICONS
import { Feather, Octicons } from '@expo/vector-icons';

import { storage } from '../../utils/storage';
import { router } from 'expo-router';
import { getAllGoals, updateGoal } from '../../API/goals/goalsApi';

const AddGoals = ({ refreshTrigger }) => {
    const style = useActionStyles();
    const [focus, setFocus] = useState(false);
    const [goal, setGoal] = useState('');
    const [goals, setGoals] = useState([]);
    const [goalId, setGoalId] = useState();
    const [userId, setUserId] = useState(null);

    // NEW: track whether we're editing an existing goal
    const [editingGoal, setEditingGoal] = useState(null); // will hold the full goal object or null

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllGoals();
    }, [refreshTrigger])

    const fetchAllGoals = useCallback(async () => {
        setLoading(true);

        try {
            const user = await storage.get("@ninety_user");
            if (!user?.id) {
                router.replace("(auth)/LoginPage.jsx");
                return;
            }

            setUserId(user.id);

            const response = await getAllGoals(userId);
            setGoals(response?.data.data);
        } catch (e) {
            console.error(e);
            Alert.alert("Failed to fetch all goals.");
        } finally {
            setLoading(false);
        }
    })

    const handleUpdateGoal = async () => {
        if (!goal.trim() || !editingGoal) return;

        try {
            const response = await updateGoal(goalId, goal.trim());
            console.log(response);

            // sync local state with the updated title
            setGoals(prevGoals =>
                prevGoals.map(g =>
                    g.id === editingGoal.id ? { ...g, title: goal.trim() } : g
                )
            );

            setEditingGoal(null);
            setGoal("");
        } catch (e) {
            console.log(e);
            Alert.alert("Update failed. Please try again.");
        }
    };

    const handleAddGoals = () => {
        if (!goal.trim()) return;

        // ADD MODE only now — update mode has its own handler
        const newGoal = {
            id: Date.now(),
            title: goal.trim(),
            createdAt: new Date().toISOString(),
        };

        setGoals(prevGoals => [...prevGoals, newGoal]);
        setGoal("");
    };

    // NEW: called when a goal tag is tapped
    const handleSelectGoal = (goalItem) => {
        setEditingGoal(goalItem);
        setGoal(goalItem.title);
        setGoalId(goalItem.id);
    };

    const handleCancelEdit = () => {
        setEditingGoal(null);
        setGoal("");
    };

    return (
        <View>
            {/* TITLE */}
            <Text style={style.boardTitle}>
                {
                    goal === "" ? "ADD YOUR GOALS" : "UPDATE YOUR GOAL"
                }
            </Text>

            {/* ADD INPUT */}
            <View style={style.goalsAddInputContainer}>
                <View style={style.goalsInputParent}>
                    <Octicons name='goal' style={[style.goalsInputIcon, {
                        backgroundColor: focus ?
                            style.goalsAddInputCursor :
                            style.goalsAddInputNotFocus
                    }]}
                    />
                    <TextInput
                        style={[style.goalsAddInput,
                        focus && style.goalsAddInputFocused]}
                        placeholder={editingGoal ? 'Update your goal' : 'Enter your goal'}
                        placeholderTextColor={'#535353'}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        cursorColor={style.goalsAddInputCursor}
                        value={goal}
                        onChangeText={(text) => setGoal(text)}
                        maxLength={30}
                    />
                    <Text style={[style.goalsLengthCount, {
                        color: focus ?
                            style.goalsAddInputCursor :
                            style.goalsAddInputNotFocus
                    }]}
                    >
                        {goal.trim().length}/30
                    </Text>
                </View>

                {/* Cancel button, only visible while editing */}
                {editingGoal && (
                    <TouchableOpacity
                        style={style.addBtn}
                        activeOpacity={0.8}
                        onPress={handleCancelEdit}
                    >
                        <Feather name='x' style={style.addBtnTitle} />
                    </TouchableOpacity>
                )}

                {/* Add/Update Input Button */}
                <TouchableOpacity
                    style={[style.addBtn,
                    {
                        backgroundColor: goal.trim().length > 0 ?
                            style.addBtnActive : style.addBtnInactive
                    }]}
                    activeOpacity={0.8}
                    onPress={() => editingGoal ? handleUpdateGoal() : handleAddGoals()}
                >
                    <Feather name={editingGoal ? 'check' : 'plus'} style={style.addBtnTitle} />
                </TouchableOpacity>
            </View>

            {/* GOALS */}
            <GoalTag
                goals={goals}
                setGoals={setGoals}
                loading={loading}
                setGoalId={setGoalId}
                onSelectGoal={handleSelectGoal}
                selectedGoalId={editingGoal?.id}
            />
        </View>
    );
}

export default AddGoals;