import { View, Text, TouchableOpacity } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { EvilIcons, Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Switch } from 'react-native-switch';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';




const Notifications = () => {
    const style = useSettingStyles();

    const theme = useSelector((state) => state.theme.theme);
    const [dailyRemainder, setDailyRemainder] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [remainderTime, setRemainderTime] = useState(new Date());
    const [aiCoachDigest, setAiCoachDigest] = useState(false);
    const [mileStone, setMileStone] = useState(false);

    const handleDailyRemainder = () => {
        setDailyRemainder((prev) => prev = !prev);
    }

    const handleRemainderTime = () => {
        setShowTimePicker(true);
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);

        if (event.type === 'set' && selectedTime) {
            setSelectedTime(selectedTime);
            setRemainderTime(selectedTime);
        }
    };

    const handleAiCoachDigest = () => {
        setAiCoachDigest((prev) => prev = !prev);
    }

    const handleMileStone = () => {
        setMileStone((prev) => prev = !prev);
    }

    const tabItems = [
        {
            id: 'daily-remainder',
            title: "Daily remainder",
            desc: "Check in everyday",
            toggleBtn: true,
            Icon: Ionicons,
            iconName: "notifications-outline",
            value: dailyRemainder,
            changeValue: handleDailyRemainder
        },
        {
            id: 'remainder-time',
            title: "Remainder time",
            desc: "When to notify you",
            toggleBtn: false,
            Icon: Octicons,
            iconName: "history",
            value: remainderTime,
            changeValue: handleRemainderTime
        },
        {
            id: 'ai-coach-digest',
            title: "AI coach digest",
            desc: "When to notify you",
            toggleBtn: true,
            Icon: Ionicons,
            iconName: "sparkles-outline",
            value: aiCoachDigest,
            changeValue: handleAiCoachDigest
        },
        {
            id: 'mile-stone-alerts',
            title: "Mile stone alerts",
            desc: "At 30, 60 and 90 days",
            toggleBtn: true,
            Icon: Feather,
            iconName: "check-square",
            value: mileStone,
            changeValue: handleMileStone
        }
    ]
    return (
        <View>
            <Text style={style.componentTitle}>Notifications</Text>

            {/* Notifications Container */}
            <View style={style.notificationContainer}>
                {
                    tabItems.map((tab, index) => {

                        const Icon = tab.Icon;

                        return (
                            <View
                                key={tab.id}
                                style={[
                                    style.notificationItem,
                                    index > 0 && style.notificationItemWithBorder
                                ]}
                            >

                                <View style={style.notification}>
                                    {/* ICON */}
                                    <View style={style.challengeHeadingIconContainer}>
                                        <Icon name={tab.iconName} style={style.challengeHeadingIcon} />
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
                                    tab.toggleBtn ? (
                                        <View style={{
                                            paddingRight: 10
                                        }}>
                                            <Switch
                                                value={tab.value}
                                                onValueChange={tab.changeValue}
                                                renderActiveText={false}
                                                renderInActiveText={false}
                                                circleSize={23}
                                                changeValueImmediately={true}
                                                backgroundActive={theme.primary}
                                                backgroundInactive={theme.backgroundMutedExtra}
                                                circleActiveColor={theme.background}
                                                circleInActiveColor={theme.background}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ paddingRight: 10 }}>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => handleRemainderTime()}
                                                style={style.remainderTimeBtn}
                                            >
                                                <Text style={style.remainderValueStyle}>
                                                    {tab.value.toLocaleTimeString([], {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }

                            </View>
                        )
                    })
                }
                {/* Reset Challenge */}

            </View>

            {showTimePicker && (
                <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={onTimeChange}
                />
            )}

        </View>
    )
}

export default Notifications