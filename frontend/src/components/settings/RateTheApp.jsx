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
                    Array.from({ length: 5 }).map((_, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleRatting(index)}
                            >
                                <Ionicons name='star' size={30} style={{
                                    color: index <= ratting ? "#ff6f00" : "#423529"
                                }} />
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
                    placeholderTextColor={'#979797'}
                    caretHidden={false}
                />

                <TouchableOpacity style={style.submitBtn}>
                    <Text style={style.submitBtnTitle}>
                        Submit
                    </Text>
                </TouchableOpacity>

                <View>
                    <Text style={style.componentTitle}>Reviews</Text>

                    <View style={style.reviewContainer}>
                        {
                            Array.from({ length: 5 }).map((_, i) => {
                                return (
                                    <View key={i} style={style.review}>
                                        <View style={style.reviewer}>
                                            <View style={style.dp}><Text style={style.dpTitle}>KM</Text></View>
                                            <View style={style.rattingAndJoinedContainer}>
                                                <Text style={style.userName}>Khageswar Maharana</Text>
                                                <Text style={style.userRatting}>{
                                                    Array.from({ length: 5 }).map((_, i) => {
                                                        return (
                                                            <Ionicons name='star' style={style.userRattingIcon} />
                                                        )
                                                    })
                                                }</Text>
                                            </View>
                                        </View>

                                        <View style={style.userFeedbackContainer}>
                                            <Text style={style.userFeedback}>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione deleniti officiis aspernatur ut blanditiis perspiciatis et? Id, velit autem!
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        </SubPages>
    )
}

export default RateTheApp