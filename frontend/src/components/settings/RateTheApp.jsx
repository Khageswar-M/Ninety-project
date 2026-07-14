import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import SubPages from '../common/SubPages'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useSettingStyles } from '../../hook/useThemeStyles'

const RateTheApp = () => {
    const style = useSettingStyles();

    const [ratting, setRatting] = useState();
    const [feedback, setFeedback] = useState("");

    const handleRatting = (rattingNum) => {
        setRatting(rattingNum);
    }

    return (
        <SubPages
            title={"Rate the App"}
        >
            <View
                style={style.rattingStarsContainer}
            >
                {
                    Array.from({length:5}).map((_, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleRatting(index)}
                            >
                                <Ionicons name='star' size={30} style={{
                                    color: index <= ratting ? "#ff6f00" : "#423529"
                                }}/>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>

            <View style={style.feedbackContainer}>
                <TextInput
                    placeholder='Enter your feedback'
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    numberOfLines={5}
                    textAlignVertical='top'
                    style={style.feedbackInput}
                />
            </View>
        </SubPages>
    )
}

export default RateTheApp