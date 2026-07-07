import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
// STATES
import { useState } from 'react';

// COMPONENT
import GoalTag from '../common/GoalTag';

// HOOKS
import { useActionStyles } from '../../hook/useThemeStyles'

// ICONS
import { Feather, Octicons } from '@expo/vector-icons';

const AddGoals = () => {
    const style = useActionStyles();
    const [focus, setFocus] = useState(false);
    const [goal, setGoal] = useState('');
    const [goals, setGoals] = useState([
        {
            id: 1,
            title: "Make physic",
            createdAt: '12/05/2026T12:00'
        },
        {
            id: 2,
            title: "Complete",
            createdAt: '12/05/2026T12:00'
        },
        {
            id: 3,
            title: "DSA",
            createdAt: '12/05/2026T12:00'
        },
        {
            id: 4,
            title: "Project",
            createdAt: '12/05/2026T12:00'
        },
        {
            id: 5,
            title: "Project that makes you win!",
            createdAt: '12/05/2026T12:00'
        },
    ]);
    console.log(goal);
    const handleAddGoals = () => {
            if (!goal.trim()) return;

            const newGoal = {
                id: Date.now(),
                title: goal.trim(),
                createdAt: new Date().toISOString(),
            };

            setGoals(prevGoals => [...prevGoals, newGoal]);
            setGoal("");
        };
    return (
        <View>
            {/* TITLE */}
            <Text style={style.boardTitle}>ADD YOUR GOALS</Text>

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
                        placeholder='Enter your goal'
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


                {/* Add Input Button */}
                <TouchableOpacity
                    style={[style.addBtn,
                    {
                        backgroundColor: goal.trim().length > 0 ?
                            style.addBtnActive : style.addBtnInactive
                    }]}
                    activeOpacity={0.8}
                    onPress={() => handleAddGoals()}
                >
                    <Feather name='plus' style={style.addBtnTitle} />
                </TouchableOpacity>
            </View>

            {/* GOALS */}
            <GoalTag goals={goals} callBack={setGoals} />
        </View>
    );
}

export default AddGoals;