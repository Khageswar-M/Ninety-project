import { Feather, Ionicons, Octicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Switch } from 'react-native-switch';
import { useDispatch, useSelector } from 'react-redux';
import { addExpoPushNotificationToken, getSettings, toggleAiCoachDigest, toggleDailyReminder, toggleMileStone, updateReminderTime } from '../../API/settings/settingsApi';
import { useSettingStyles } from '../../hook/useThemeStyles';
import {
    setAiCoachDigest,
    setDailyRemainder,
    setMilestoneAlerts,
    setRemainderTime
} from '../../redux/slices/notificationSlice';
import { setDarkTheme, setLightTheme } from '../../redux/slices/themeSlice';
import { storage } from '../../utils/storage';
// import { usePushNotifications } from '../../hook/usePushNotifications';
import { usePushNotifications } from '../../hook/usePushNotifications';
// import * as ExpoNotifications from "expo-notifications";




const Notifications = () => {
    const style = useSettingStyles();
    const theme = useSelector((state) => state.theme.theme);
    const colorScheme = useColorScheme();
    // const { expoPushToken } = usePushNotifications();

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


    const {
        expoPushToken,
        permissionStatus,
        checkPermissionStatus,
        requestPermissionAndRegister,
        openNotificationSettings,
    } = usePushNotifications();

    const pendingEnableRef = useRef(false);

    const syncTokenToBackend = async (token) => {
        if (!token) return;
        try {
            await addExpoPushNotificationToken(token, Platform.OS);
        } catch (err) {
            console.error("Failed to sync push token with backend:", err);
        }
    };

    const completeEnable = async () => {
        dispatch(setDailyRemainder(true));
        await storage.set(STORAGE_KEY.DAILY_REMAINDER, true);
        enqueueRequest(dailyReminderQueue, () => toggleDailyReminder());
    };

    const handleDailyRemainder = async () => {
        const value = !dailyRemainder;

        if (!value) {
            // Turning OFF — no permission check needed
            dispatch(setDailyRemainder(false));
            await storage.set(STORAGE_KEY.DAILY_REMAINDER, false);
            enqueueRequest(dailyReminderQueue, () => toggleDailyReminder());
            return;
        }

        // Turning ON — verify real OS permission first
        const status = await checkPermissionStatus();

        if (status === "granted") {
            await syncTokenToBackend(expoPushToken);
            await completeEnable();
            return;
        }

        if (status === "undetermined") {
            const { status: newStatus, token } = await requestPermissionAndRegister();

            if (newStatus === "granted") {
                await syncTokenToBackend(token);
                await completeEnable();
            } else {
                Alert.alert(
                    "Notifications not enabled",
                    "You need to allow notifications to turn on daily reminders."
                );
            }
            return; // toggle stays off
        }

        // status === "denied" — OS won't show a prompt again, must go to Settings
        pendingEnableRef.current = true;
        Alert.alert(
            "Notifications are disabled",
            "Please enable notifications for this app in your phone settings, then come back here.",
            [
                { text: "Cancel", style: "cancel", onPress: () => (pendingEnableRef.current = false) },
                { text: "Open Settings", onPress: openNotificationSettings },
            ]
        );
        // toggle stays off until the user actually enables it and returns
    };

    // Re-check permission when the app regains focus (i.e. user comes back from Settings)
    useEffect(() => {
        const subscription = AppState.addEventListener("change", async (nextState) => {
            if (nextState !== "active" || !pendingEnableRef.current) return;

            const status = await checkPermissionStatus();

            if (status === "granted") {
                pendingEnableRef.current = false;
                const { token } = await requestPermissionAndRegister();
                await syncTokenToBackend(token);
                await completeEnable();
            }
            // if still denied, leave toggle off and pendingEnableRef stays true —
            // user can try again next time they background/foreground the app
        });

        return () => subscription.remove();
    }, []);

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
            <Text style={style.componentTitle}>NOTIFICATIONS</Text>

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