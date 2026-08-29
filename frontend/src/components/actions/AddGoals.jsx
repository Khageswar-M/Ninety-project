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
import { createGoal, getAllGoals, updateGoal } from '../../API/goals/goalsApi';

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
            // console.log(response.data.data);

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

    const handleAddGoals = async () => {
        const trimmedGoal = goal.trim();

        // 1. don't submit empty goals
        if(!trimmedGoal) return;

        // 2. generate a temporary id for optimistic rendering
        const tempId = `temp-${Date.now()}-${Math.random()}`;

        // 3. create optimistic goal
        const optimisticGoal = {
            id: tempId,
            title: trimmedGoal,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLoading: true
        }

        // 4. immediately render the goal.
        setGoals(prevGoals => [...prevGoals, optimisticGoal]);

        // 5. clear input immediately
        setGoal("");

        try{
            // 6. call backend
            const response = await createGoal(trimmedGoal);

            // 7. validate response
            if(!response?.data?.success || !response?.data?.data){
                throw new Error(
                    response?.data?.message || "Failed to create goal."
                );
            }

            const createdGoal = response.data.data;

            // 8. update only temporary goal
            // with actual backend operation
            setGoals(prevGoals => 
                prevGoals.map(existingGoal => 
                    existingGoal.id === tempId
                        ? {
                            ...createdGoal,
                            isLoading: false
                        }
                        : existingGoal
                )
            );

            console.log("Goal created successfully: ", createdGoal);
        }catch(error){
            console.error("Error creating goal ", error);

            // 9. if api fails, remove the optimistic goal
            setGoals(prevGoals => 
                prevGoals.filter(existingGoal => existingGoal.id !== tempId)
            );

            // 10. restore the user input
            setGoal(trimmedGoal);

            // 11. show error to the user
        }
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

                    <Octicons 
                        name={editingGoal ? 'x' : 'goal'} 
                        style={[
                            style.goalsInputIcon, {
                            backgroundColor: focus ?
                                style.goalsAddInputCursor :
                                style.goalsAddInputNotFocus
                            }
                        ]}

                        onPress={() => editingGoal && handleCancelEdit()}
                    />

                    <TextInput
                        style={[
                            style.goalsAddInput,
                            focus && style.goalsAddInputFocused
                        ]}
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

                {/* Add/Update Input Button */}
                <TouchableOpacity
                    style={[
                        style.addBtn,
                        {
                            backgroundColor: goal.trim().length > 0 ?
                                style.addBtnActive : style.addBtnInactive
                        }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => editingGoal ? handleUpdateGoal() : handleAddGoals()}
                >
                    <Feather 
                        name={editingGoal ? 'check' : 'plus'} 
                        style={style.addBtnTitle} 
                    />
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
                isEditingGoal={editingGoal}
                setEditingGoal = {setEditingGoal}
                isGoal = {goal}
                setGoal = {setGoal}
            />
        </View>
    );
}

export default AddGoals;