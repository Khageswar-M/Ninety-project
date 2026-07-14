import { View, Text } from 'react-native'
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useSettingStyles } from '../../hook/useThemeStyles'
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const About = () => {
    const style = useSettingStyles();

    const [version, setVersion] = useState();
    const [privacy, setPrivacy] = useState();
    const [rateApp, setRateApp] = useState();

    const handleVersion = () => {

    }

    const handlePrivacy = () => {
        router.push("/privacyPolicy");
    }

    const handleRateApp = () => {
        router.push("/rateApp")
    }

    const tabItems = [
        {
            id: 'app-version',
            title: "App version",
            desc: "90-days module",
            chevron: false,
            Icon: MaterialIcons,
            iconName: "error-outline",
            value: version,
            changeValue: handleVersion,
        },
        {
            id: 'privacy-policy',
            title: "Privacy policy",
            desc: "How your data is used ?",
            chevron: true,
            Icon: Feather,
            iconName: "shield",
            value: privacy,
            changeValue: handlePrivacy
        },
        {
            id: 'rate-the-app',
            title: "Rate the app",
            desc: "Leave a review",
            chevron: true,
            Icon: Feather,
            iconName: "star",
            value: rateApp,
            changeValue: handleRateApp
        },
    ]
    return (
        <View>
            <Text style={style.componentTitle}>About</Text>

            <View style={style.notificationContainer}>
                {
                    tabItems.map((tab, index) => {

                        const Icon = tab.Icon;

                        return (
                            <View style={[
                                style.resetChallengeWrapper, index > 0 ? {
                                    borderTopWidth: 1
                                } : {
                                    borderTopWidth: 0
                                }
                            ]}
                                key={tab.id}
                            >
                                <TouchableOpacity
                                    activeOpacity={
                                        index > 0 ? 0.5 : 1
                                    }
                                    style={style.resetChallengeContainer}
                                    onPress={() => tab.changeValue()}
                                >

                                    <View style={style.notification}>
                                        {/* ICON */}
                                        <View style={style.challengeHeadingIconContainer}>
                                            <Icon name={tab.iconName} style={[style.challengeHeadingIcon, {
                                                backgroundColor: '#000',
                                                color: '#afafaf',
                                                borderRadius: 4
                                            }]} />
                                        </View>

                                        {/* Title */}
                                        <View style={style.challengeTitleContainer}>
                                            <Text style={style.challengeTitle}>
                                                {tab.title}
                                            </Text>
                                            <Text style={style.challengeDesc}>
                                                {tab.desc}
                                            </Text>
                                        </View>

                                    </View>

                                    {
                                        tab.chevron ? (
                                            <View style={{ paddingRight: 10 }}>
                                                <Ionicons name='chevron-forward' style={style.chevronIconRight} />
                                            </View>
                                        ) : (
                                            <View style={style.versionTitleTab}>
                                                <Text style={style.versionTitle}>V1.0.0</Text>
                                            </View>
                                        )
                                    }

                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
                {/* Reset Challenge */}

            </View>
        </View>
    )
}

export default About