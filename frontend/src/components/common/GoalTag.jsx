import { View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { useActionStyles } from '../../hook/useThemeStyles'
import DeleteConfirmModal from '../modals/DeleteConfirmModal.jsx'

const GoalTag = ({ goals, callBack }) => {
    const style = useActionStyles();
    const [visible, setVisible] = useState(false)

    const handleDelete = () => {
        // const confirm = window.alert("Are you sure");
        setVisible(false);
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
                    goals.map((goal, index) => {
                        console.log(goal.title);
                        return (
                            <TouchableOpacity
                            activeOpacity={0.5}
                                key={index}
                                style={style.goalsTag}
                                onPress={() => setVisible(true)}
                            >
                                <Text style={style.goalsTagTitle}>{goal.title}</Text>
                                <Feather name='plus' style={style.goalsTagIcon} />
                            </TouchableOpacity>
                        )
                    })
                }
            </View>

            <DeleteConfirmModal
                isVisible={visible}
                onCancel={() => setVisible(false)}
                onDelete={handleDelete}
            />
        </View>
    )
}

export default GoalTag;