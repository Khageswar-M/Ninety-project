import { View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { useActionStyles } from '../../hook/useThemeStyles'
import ConfirmationModal from '../modals/ConfirmationModal.jsx'

const GoalTag = ({ goals, setGoals }) => {
    const style = useActionStyles();
    const [visible, setVisible] = useState(false)
    const [selectedGoalId, setSelectedGoalId] = useState(null);

    const openDeleteModal = (goalId) => {
        setSelectedGoalId(goalId);
        setVisible(true);
    }

    const handleDelete = async () => {

        try{
            console.log('deleting...');
            setGoals((prevGoals) => prevGoals.filter((goal) => goal.id != selectedGoalId));
        }finally{
            setVisible(false);
            setSelectedGoalId(null);
        }
    }
    return (
        <View style={style.goalsTagContainer}>
            <Text style={style.boardTitle}>GOALS</Text>
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    alignItems: "flex-start",
                }}
            >
                {
                    goals.map((goal) => {
                        console.log(goal.title);
                        return (
                            <TouchableOpacity
                            activeOpacity={0.5}
                                key={goal.id}
                                style={style.goalsTag}
                                onPress={() => openDeleteModal(goal.id)}
                            >
                                <Text style={style.goalsTagTitle}>{goal.title}</Text>
                                <Feather name='plus' style={style.goalsTagIcon} />
                            </TouchableOpacity>
                        )
                    })
                }
            </View>

            <ConfirmationModal
                isVisible={visible}
                onCancel={() => setVisible(false)}
                onAction={handleDelete}
                title={"Delete Item"}
                message={"Are you sure you want to delete this item ? This action cannot be undone."}
            />
        </View>
    )
}

export default GoalTag;