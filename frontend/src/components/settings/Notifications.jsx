import { View, Text, TouchableOpacity } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { EvilIcons, Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Switch } from 'react-native-switch';
import { useSelector, useDispatch } from 'react-redux';
import {
    setDailyRemainder,
    setRemainderTime,
    setAiCoachDigest,
    setMilestoneAlerts
} from '../../redux/slices/notificationSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { storage } from '../../utils/storage';
import { getSettings, toggleAiCoachDigest, toggleDailyReminder, toggleMileStone, updateReminderTime } from '../../API/settings/settingsApi';
import { setDarkTheme, setLightTheme } from '../../redux/slices/themeSlice';
import { useColorScheme } from 'react-native';


const Notifications = () => {
    const style = useSettingStyles();
    const theme = useSelector((state) => state.theme.theme);
    const colorScheme = useColorScheme();

    const STORAGE_KEY = {
        DAILY_REMAINDER: "dailyRemainder",
        REMAINDER_TIME: "remainderTime",
        AI_COACH: "aiCoachDigest",
        MILESTONE: "milestoneAlert"
    }

    useEffect(() => {
        loadNotificationSettings();
    }, []);

    const loadNotificationSettings = async () => {
        try {
            const dailyRemainder = await storage.get(STORAGE_KEY.DAILY_REMAINDER);
            const remainderTime = await storage.get(STORAGE_KEY.REMAINDER_TIME);
            const aiCoach = await storage.get(STORAGE_KEY.AI_COACH);
            const mileStone = await storage.get(STORAGE_KEY.MILESTONE);

            if (dailyRemainder != null) {
                dispatch(setDailyRemainder(dailyRemainder));
            }

            if (remainderTime) {
                const date = new Date(remainderTime);
                dispatch(setRemainderTime(remainderTime));
                setSelectedTime(date);
                console.log(remainderTime)
            }

            if (aiCoach != null) {
                dispatch(setAiCoachDigest(aiCoach));
            }

            if (mileStone != null) {
                dispatch(setMilestoneAlerts(mileStone));
            }

            const response = await getSettings();
            const responseData = response?.data?.data;
            console.log(responseData)
            if (responseData) {

                // check for Daily Reminder
                if (dailyRemainder !== responseData.dailyRemainder) {
                    dispatch(setDailyRemainder(responseData.dailyRemainder))
                }

                // check for Reminder time
                if (remainderTime !== responseData.reminderTime) {
                    dispatch(setRemainderTime(responseData.reminderTime));
                }

                // check for AI Coach Digest
                if (aiCoach !== responseData.aiCoachDigest) {
                    dispatch(setAiCoachDigest(responseData.aiCoachDigest))
                }

                // check for Mile stone alerts
                if (mileStone !== responseData.mileStoneAlert) {
                    dispatch(setMilestoneAlerts(responseData.mileStoneAlert));
                }

                // check for theme
                if (responseData.theme === 'DARK') {
                    dispatch(setDarkTheme());
                } else if (responseData.theme === 'LIGHT') {
                    dispatch(setLightTheme())
                } else {
                    colorScheme === "dark"
                        ? dispatch(setDarkTheme())
                        : dispatch(setLightTheme());
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const dispatch = useDispatch();

    const {
        dailyRemainder,
        remainderTime,
        aiCoachDigest,
        milestoneAlert,
    } = useSelector((state) => state.notification);


    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());

    const dailyReminderQueue = useRef(Promise.resolve());
    const reminderTimeQueue = useRef(Promise.resolve());
    const aiCoachQueue = useRef(Promise.resolve());
    const milestoneQueue = useRef(Promise.resolve());

    const enqueueRequest = (queue, apiCall) => {
        queue.current = queue.current
            .catch(() => { })
            .then(() => apiCall());

        return queue.current;
    }

    const handleDailyRemainder = async () => {
        const value = !dailyRemainder;
        dispatch(setDailyRemainder(value));

        await storage.set(STORAGE_KEY.DAILY_REMAINDER, value);

        enqueueRequest(
            dailyReminderQueue,
            () => toggleDailyReminder()
        );
    }

    const handleTimeChange = async (event, time) => {
        setShowTimePicker(false);

        if (event.type !== "set" || !time) return;

        setSelectedTime(time);

        dispatch(setRemainderTime(time.toISOString()));
        console.log(time.toISOString());

        await storage.set(
            STORAGE_KEY.REMAINDER_TIME,
            time.toISOString()
        );

        enqueueRequest(
            reminderTimeQueue,
            () => updateReminderTime(time.toISOString())
        );
    };

    const handleAiCoachDigest = async () => {
        const value = !aiCoachDigest;
        dispatch(setAiCoachDigest(value));

        await storage.set(STORAGE_KEY.AI_COACH, value);

        enqueueRequest(
            aiCoachQueue,
            () => toggleAiCoachDigest()
        );
    }

    const handleMileStone = async () => {
        const value = !milestoneAlert;
        dispatch(setMilestoneAlerts(value));

        await storage.set(STORAGE_KEY.MILESTONE, value);

        enqueueRequest(
            milestoneQueue,
            () => toggleMileStone()
        );
    }

    const tabItems = [
        {
            id: 'daily-remainder',
            title: "Daily reminder",
            desc: "Check in everyday",
            toggleBtn: true,
            Icon: Ionicons,
            iconName: "notifications-outline",
            value: dailyRemainder,
            changeValue: handleDailyRemainder
        },
        {
            id: 'remainder-time',
            title: "Reminder time",
            desc: "When to notify you",
            toggleBtn: false,
            Icon: Octicons,
            iconName: "history",
            value: remainderTime,
            changeValue: handleTimeChange
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
            value: milestoneAlert,
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
                                                onPress={() => setShowTimePicker(true)}
                                                style={style.remainderTimeBtn}
                                            >
                                                <Text style={style.remainderValueStyle}>
                                                    {new Date(tab.value).toLocaleTimeString([], {
                                                        hour: "numeric",
                                                        minute: "2-digit",
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
                    onChange={handleTimeChange}
                />
            )}

        </View>
    )
}

export default Notifications