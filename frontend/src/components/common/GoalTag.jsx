import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useActionStyles } from '../../hook/useThemeStyles'
import ConfirmationModal from '../modals/ConfirmationModal.jsx'
import EmptySvg from '../../../assets/icons/opps.svg';
console.log("EmptySvg:", EmptySvg);
console.log("EmptySvg type:", typeof EmptySvg);

const GoalTag = ({ goals, setGoals, loading, setGoalId, onSelectGoal, selectedGoalId }) => {
    const style = useActionStyles();
    const [visible, setVisible] = useState(false)
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const openDeleteModal = (goalId) => {
        setDeleteTargetId(goalId);
        setVisible(true);
    }

    const handleDelete = async () => {

        try {
            console.log('deleting...');
            setGoals((prevGoals) => prevGoals.filter((goal) => goal.id != deleteTargetId));
        } finally {
            setVisible(false);
            setDeleteTargetId(null);
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

                    loading ? (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                marginTop: 20,
                            }}
                        >
                            <ActivityIndicator size={30} color={'orange'} />
                        </View>
                    ) : (
                        goals.length <= 0 ? (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    marginTop: 20,
                                }}
                            >
                                <EmptySvg
                                    width={150}
                                    height={150}
                                />
                            </View>
                        ) :

                            (
                                goals.map((goal) => {
                                    const isSelected = goal.id === selectedGoalId;
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            key={goal.id}
                                            style={[
                                                style.goalsTag,
                                                isSelected && {
                                                    borderWidth: 1.5,
                                                    borderColor: '#ffffff',
                                                }
                                            ]}
                                            onPress={() => onSelectGoal(goal)}
                                        >
                                            <Text style={style.goalsTagTitle}>{goal.title}</Text>

                                            <TouchableOpacity onPress={() => openDeleteModal(goal.id)}>
                                                <Entypo name='cross' style={style.goalsTagIcon} />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    );
                                })
                            )
                    )
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