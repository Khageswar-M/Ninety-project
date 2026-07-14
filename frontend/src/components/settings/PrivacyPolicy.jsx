import { View, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { Ionicons, Foundation } from '@expo/vector-icons'
import { useState } from 'react'
import SubPages from '../common/SubPages'

const PrivacyPolicy = () => {
    const style = useSettingStyles();

    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);

    const policies = [
        {
            policy: "Your privacy is important to us. We only collect the information needed to create your account, help you complete your 90-day challenges, and improve your experience."
        },
        {
            policy: "When you sign up, we collect your name and email address. We also send a one-time verification code (OTP) to your email so you can log in securely. This OTP is automatically deleted after it is used or expires."
        },
        {
            policy: "We store your challenge details, daily progress, streaks, and completion history so you can track your journey. We also save your device's notification token to send reminders, streak alerts, and important app updates if notifications are enabled."
        },
        {
            policy: "If you use the AI Coach, the messages you send are securely shared with our AI service only to generate helpful responses. Your conversations are not used to train AI models. We also collect basic app performance and crash information to fix problems and make Ninety better."
        },
        {
            policy: "Your information is protected using industry-standard security measures. Data is encrypted, OTPs are short-lived, suspicious login attempts are blocked, and access to your information is limited to authorized systems only."
        },
        {
            policy: "Your information is protected using industry-standard security measures. Data is encrypted, OTPs are short-lived, suspicious login attempts are blocked, and access to your information is limited to authorized systems only."
        },
        {
            policy: "Your information is protected using industry-standard security measures. Data is encrypted, OTPs are short-lived, suspicious login attempts are blocked, and access to your information is limited to authorized systems only."
        },
        {
            policy: "Your information is protected using industry-standard security measures. Data is encrypted, OTPs are short-lived, suspicious login attempts are blocked, and access to your information is limited to authorized systems only."
        },
    ]

    const handleLike = () => {
        setDislike(false);
        setLike((prev) => prev = !prev);
    }

    const handleDislike = () => {
        setLike(false);
        setDislike((prev) => prev = !prev);
    }
    return (

        <>
            <SubPages
                title={"Privacy Policy"}
            >
                <View style={style.policyContainer}>
                    <View style={style.policyHeader}>
                        <Text style={style.policyHeaderTitle}>Ninety</Text>
                        <Text style={style.policyHeaderDesc}>Last Updated: July 14, 2026</Text>
                    </View>

                    {
                        policies.map((pol, idx) => {
                            return (
                                <Text key={idx} style={style.policyContent}>
                                    - {pol.policy}
                                </Text>
                            )
                        })
                    }
                </View>
            </SubPages>
            <View style={style.likeDislikeContainer}>
                <View style={style.likeDislikeSubContainer}>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleLike()}
                        style={{ paddingHorizontal: 5 }}
                    >
                        <Foundation
                            name='like'
                            size={25}
                            style={[style.likeDislikeBtn, like && { color: "#83f64d" }]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleDislike()}
                        style={{ paddingHorizontal: 5 }}
                        activeOpacity={0.7}
                    >
                        <Foundation
                            name='dislike'
                            size={25}
                            style={[style.likeDislikeBtn, , dislike && { color: "#ff2323" }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default PrivacyPolicy