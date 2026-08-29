import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useActionStyles } from '../../hook/useThemeStyles'
import ConfirmationModal from '../modals/ConfirmationModal.jsx'
import EmptySvg from '../../../assets/icons/opps.svg';
import { deleteGoal } from '../../API/goals/goalsApi.js'
console.log("EmptySvg:", EmptySvg);
console.log("EmptySvg type:", typeof EmptySvg);

const statusOrder = {
    PENDING: 0,
    PROGRESS: 1,
    COMPLETE: 2,
};

const GoalTag = ({
    goals,
    setGoals,
    loading,
    setGoalId,
    onSelectGoal,
    selectedGoalId,
    isEditingGoal,
    setEditingGoal,
    isGoal,
    setGoal,
    isProgress,
    setIsProgress,
    progress
}) => {
    const style = useActionStyles();
    const [visible, setVisible] = useState(false)
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [sheetVisible, setSheetVisible] = useState(true);

    const openDeleteModal = (goalId) => {
        setDeleteTargetId(goalId);
        setVisible(true);
    }

    const handleDelete = async () => {
        if (isEditingGoal) setEditingGoal(null);
        if (isGoal.trim()) setGoal('');
        setIsProgress(null);
        setVisible(false);
        try {
            console.log('deleting...');
            setGoals((prevGoals) => prevGoals.filter((goal) => goal.id != deleteTargetId));
            const response = await deleteGoal(deleteTargetId);
            console.log(response.data);
        } catch (error) {
            console.log("Delete failed ", error);
        } finally {
            setDeleteTargetId(null);
        }
    }

    const handleOnModalCancel = () => {
        setIsProgress(null);
        setVisible(false);
        setDeleteTargetId(null);
        setGoal('');
        if (isEditingGoal) setEditingGoal(null);
    }

    const handleLongPress = (goal) => {
        console.log(goal);
        setIsProgress(true);
        setIsProgress(goal);
    }

    return (
        <>
            <View style={style.goalsTagContainer}>
                <Text style={style.boardTitle}>GOALS</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20
                    }}
                >
                    {
                        progress.map(p => {
                            return (
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Entypo name='dot-single' size={20} color={p.color}/>
                                    <Text style={{
                                        fontSize: 10,
                                        color: '#949494'
                                    }}>{p.title}</Text>
                                </View>
                            )
                        })
                    }
                </View>

                
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 10,
                        alignItems: "flex-start",
                    }}
                >
                    {loading ? (
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
                        ) : (
                            [...goals]
                                .sort((a, b) =>
                                    statusOrder[a.status] - statusOrder[b.status]
                                )
                                .map((goal) => {

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
                                                },
                                                {
                                                    backgroundColor:
                                                        goal.status === "PENDING"
                                                            ? progress[0].color
                                                            : goal.status === "PROGRESS"
                                                                ? progress[1].color
                                                                : goal.status === "COMPLETE"
                                                                    ? progress[2].color
                                                                    : '#ff9100'
                                                }
                                            ]}
                                            onPress={() => {
                                                setIsProgress(null);
                                                onSelectGoal(goal);
                                            }}
                                            onLongPress={() => handleLongPress(goal)}
                                        >
                                            <Text
                                                style={[
                                                    style.goalsTagTitle,
                                                    goal.status === "COMPLETE" && {
                                                        textDecorationLine: 'line-through'
                                                    }
                                                ]}
                                            >
                                                {goal.title}
                                            </Text>

                                            <TouchableOpacity
                                                onPress={() => openDeleteModal(goal.id)}
                                            >
                                                {goal.isLoading ? (
                                                    <ActivityIndicator
                                                        size={18}
                                                        color={'orange'}
                                                    />
                                                ) : (
                                                    <Entypo
                                                        name="cross"
                                                        style={style.goalsTagIcon}
                                                    />
                                                )}
                                            </TouchableOpacity>

                                        </TouchableOpacity>
                                    );
                                })
                        )
                    )}
                </View>

                <ConfirmationModal
                    isVisible={visible}
                    onCancel={handleOnModalCancel}
                    onAction={handleDelete}
                    title={"Delete Item"}
                    message={"Are you sure you want to delete this item ? This action cannot be undone."}
                />


            </View>
        </>
    )
}

export default GoalTag;