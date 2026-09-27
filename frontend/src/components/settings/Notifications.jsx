import { Feather, Ionicons, Octicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    AppState,
    Platform,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { Switch } from 'react-native-switch';
import { useDispatch, useSelector } from 'react-redux';

import {
    addExpoPushNotificationToken,
    getSettings,
    toggleAiCoachDigest,
    toggleDailyReminder,
    toggleMileStone,
    updateReminderTime,
} from '../../API/settings/settingsApi';

import { usePushNotifications } from '../../hook/usePushNotifications';
import { useSettingStyles } from '../../hook/useThemeStyles';

import {
    setAiCoachDigest,
    setDailyRemainder,
    setMilestoneAlerts,
    setRemainderTime,
} from '../../redux/slices/notificationSlice';

import {
    setDarkTheme,
    setLightTheme,
} from '../../redux/slices/themeSlice';

import { storage } from '../../utils/storage';


const Notifications = () => {
    const style = useSettingStyles();
    const dispatch = useDispatch();

    const theme = useSelector((state) => state.theme.theme);
    const colorScheme = useColorScheme();

    const {
        dailyRemainder,
        remainderTime,
        aiCoachDigest,
        milestoneAlert,
    } = useSelector((state) => state.notification);

    const {
        expoPushToken,
        permissionStatus,
        checkPermissionStatus,
        requestPermissionAndRegister,
        openNotificationSettings,
    } = usePushNotifications();


    // ============================================================
    // CONSTANTS
    // ============================================================

    const STORAGE_KEY = {
        DAILY_REMAINDER: 'dailyRemainder',
        REMAINDER_TIME: 'remainderTime',
        AI_COACH: 'aiCoachDigest',
        MILESTONE: 'milestoneAlert',
    };


    // ============================================================
    // LOCAL STATE
    // ============================================================

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());


    // ============================================================
    // RACE-CONDITION PROTECTION
    // ============================================================

    /*
     * These refs are important.
     *
     * React state/Redux state updates are asynchronous.
     * If the user taps the switch very quickly:
     *
     *     ON -> OFF -> ON
     *
     * multiple async API/storage operations could otherwise
     * complete in the wrong order.
     *
     * We therefore keep the latest values in refs and serialize
     * backend requests through queues.
     */

    const latestDailyReminderRef = useRef(!!dailyRemainder);
    const latestAiCoachRef = useRef(!!aiCoachDigest);
    const latestMilestoneRef = useRef(!!milestoneAlert);
    const latestReminderTimeRef = useRef(remainderTime);

    const dailyReminderQueue = useRef(Promise.resolve());
    const reminderTimeQueue = useRef(Promise.resolve());
    const aiCoachQueue = useRef(Promise.resolve());
    const milestoneQueue = useRef(Promise.resolve());

    /*
     * Once the user manually interacts with a setting, the initial
     * getSettings() request must NOT overwrite that user's choice
     * when its response arrives later.
     */
    const userChangedDailyReminderRef = useRef(false);
    const userChangedAiCoachRef = useRef(false);
    const userChangedMilestoneRef = useRef(false);
    const userChangedReminderTimeRef = useRef(false);

    /*
     * Used for the Settings -> AppState flow.
     */
    const pendingEnableRef = useRef(false);


    // ============================================================
    // KEEP REFS IN SYNC WITH REDUX
    // ============================================================

    useEffect(() => {
        latestDailyReminderRef.current = !!dailyRemainder;
    }, [dailyRemainder]);

    useEffect(() => {
        latestAiCoachRef.current = !!aiCoachDigest;
    }, [aiCoachDigest]);

    useEffect(() => {
        latestMilestoneRef.current = !!milestoneAlert;
    }, [milestoneAlert]);

    useEffect(() => {
        latestReminderTimeRef.current = remainderTime;
    }, [remainderTime]);


    // ============================================================
    // SERIALIZED REQUEST HELPER
    // ============================================================

    const enqueueRequest = (queue, apiCall, label = 'API request') => {
        queue.current = queue.current
            .catch((previousError) => {
                console.warn(
                    `[${label}] Previous request failed, continuing queue:`,
                    previousError
                );
            })
            .then(async () => {
                try {
                    console.log(`[${label}] Starting...`);

                    const result = await apiCall();

                    console.log(`[${label}] Completed successfully.`);

                    return result;
                } catch (error) {
                    /*
                     * IMPORTANT:
                     *
                     * API failure must NOT affect the local/UI state.
                     *
                     * The user's switch has already been changed
                     * locally. Backend synchronization is best effort.
                     */
                    console.error(
                        `[${label}] Failed. Local state will NOT be reverted.`,
                        error
                    );

                    return null;
                }
            });

        return queue.current;
    };


    // ============================================================
    // LOAD SETTINGS
    // ============================================================

    useEffect(() => {
        loadNotificationSettings();
    }, []);


    const loadNotificationSettings = async () => {
        console.log('========================================');
        console.log('[Notifications] Loading notification settings...');
        console.log('========================================');

        try {
            /*
             * ----------------------------------------------------
             * STEP 1: Load local storage first
             * ----------------------------------------------------
             */

            const dailyRemainder = await storage.get(
                STORAGE_KEY.DAILY_REMAINDER
            );

            const remainderTime = await storage.get(
                STORAGE_KEY.REMAINDER_TIME
            );

            const aiCoach = await storage.get(
                STORAGE_KEY.AI_COACH
            );

            const mileStone = await storage.get(
                STORAGE_KEY.MILESTONE
            );


            console.log('[Storage] Daily reminder:', dailyRemainder);
            console.log('[Storage] Reminder time:', remainderTime);
            console.log('[Storage] AI coach:', aiCoach);
            console.log('[Storage] Milestone:', mileStone);


            /*
             * Apply local values immediately.
             *
             * BUT only if the user hasn't already interacted with
             * that setting.
             */

            if (
                dailyRemainder != null &&
                !userChangedDailyReminderRef.current
            ) {
                latestDailyReminderRef.current = !!dailyRemainder;

                dispatch(
                    setDailyRemainder(!!dailyRemainder)
                );
            }


            if (
                remainderTime &&
                !userChangedReminderTimeRef.current
            ) {
                const date = new Date(remainderTime);

                if (!Number.isNaN(date.getTime())) {
                    latestReminderTimeRef.current = remainderTime;

                    dispatch(
                        setRemainderTime(remainderTime)
                    );

                    setSelectedTime(date);
                }
            }


            if (
                aiCoach != null &&
                !userChangedAiCoachRef.current
            ) {
                latestAiCoachRef.current = !!aiCoach;

                dispatch(
                    setAiCoachDigest(!!aiCoach)
                );
            }


            if (
                mileStone != null &&
                !userChangedMilestoneRef.current
            ) {
                latestMilestoneRef.current = !!mileStone;

                dispatch(
                    setMilestoneAlerts(!!mileStone)
                );
            }


            /*
             * ----------------------------------------------------
             * STEP 2: Fetch backend settings
             * ----------------------------------------------------
             *
             * Backend failure must NOT break the notification UI.
             */

            try {
                console.log('[Settings API] Fetching settings...');

                const response = await getSettings();

                const responseData = response?.data?.data;

                console.log(
                    '[Settings API] Response:',
                    responseData
                );


                if (!responseData) {
                    console.warn(
                        '[Settings API] No settings data returned.'
                    );

                    return;
                }


                /*
                 * DAILY REMINDER
                 *
                 * Do not overwrite a value changed by the user
                 * while this request was running.
                 */

                if (
                    !userChangedDailyReminderRef.current &&
                    responseData.dailyRemainder != null
                ) {
                    latestDailyReminderRef.current =
                        !!responseData.dailyRemainder;

                    dispatch(
                        setDailyRemainder(
                            !!responseData.dailyRemainder
                        )
                    );

                    await storage.set(
                        STORAGE_KEY.DAILY_REMAINDER,
                        !!responseData.dailyRemainder
                    );
                }


                /*
                 * REMINDER TIME
                 */

                if (
                    !userChangedReminderTimeRef.current &&
                    responseData.reminderTime
                ) {
                    latestReminderTimeRef.current =
                        responseData.reminderTime;

                    dispatch(
                        setRemainderTime(
                            responseData.reminderTime
                        )
                    );

                    const date = new Date(
                        responseData.reminderTime
                    );

                    if (!Number.isNaN(date.getTime())) {
                        setSelectedTime(date);
                    }

                    await storage.set(
                        STORAGE_KEY.REMAINDER_TIME,
                        responseData.reminderTime
                    );
                }


                /*
                 * AI COACH
                 */

                if (
                    !userChangedAiCoachRef.current &&
                    responseData.aiCoachDigest != null
                ) {
                    latestAiCoachRef.current =
                        !!responseData.aiCoachDigest;

                    dispatch(
                        setAiCoachDigest(
                            !!responseData.aiCoachDigest
                        )
                    );

                    await storage.set(
                        STORAGE_KEY.AI_COACH,
                        !!responseData.aiCoachDigest
                    );
                }


                /*
                 * MILESTONE
                 */

                if (
                    !userChangedMilestoneRef.current &&
                    responseData.mileStoneAlert != null
                ) {
                    latestMilestoneRef.current =
                        !!responseData.mileStoneAlert;

                    dispatch(
                        setMilestoneAlerts(
                            !!responseData.mileStoneAlert
                        )
                    );

                    await storage.set(
                        STORAGE_KEY.MILESTONE,
                        !!responseData.mileStoneAlert
                    );
                }


                /*
                 * THEME
                 */

                if (responseData.theme === 'DARK') {
                    dispatch(setDarkTheme());
                } else if (responseData.theme === 'LIGHT') {
                    dispatch(setLightTheme());
                } else {
                    colorScheme === 'dark'
                        ? dispatch(setDarkTheme())
                        : dispatch(setLightTheme());
                }

            } catch (apiError) {
                /*
                 * Backend being unavailable must never prevent
                 * the notification switches from working locally.
                 */

                console.error(
                    '[Settings API] Failed to load settings.',
                    apiError
                );

                console.warn(
                    '[Settings API] Continuing with local settings.'
                );
            }

        } catch (error) {
            console.error(
                '[Notifications] Failed to load local settings:',
                error
            );
        }

        console.log('========================================');
        console.log('[Notifications] Settings loading finished.');
        console.log('========================================');
    };


    // ============================================================
    // PUSH TOKEN DEBUGGING
    // ============================================================

    const syncTokenToBackend = async (token) => {
        console.log('');
        console.log('========================================');
        console.log('[Push Token] SYNC START');
        console.log('========================================');

        console.log(
            '[Push Token] Platform:',
            Platform.OS
        );

        console.log(
            '[Push Token] Hook permission status:',
            permissionStatus
        );

        console.log(
            '[Push Token] Token received:',
            token
        );

        console.log(
            '[Push Token] Token type:',
            typeof token
        );


        if (!token) {
            console.warn(
                '[Push Token] ❌ No Expo push token available.'
            );

            console.log('========================================');
            console.log('[Push Token] SYNC END');
            console.log('========================================');

            return;
        }


        try {
            console.log(
                '[Push Token] Sending token to backend...'
            );

            const response =
                await addExpoPushNotificationToken(
                    token,
                    Platform.OS
                );

            console.log(
                '[Push Token] ✅ Backend sync successful:',
                response
            );

        } catch (error) {
            /*
             * Again, backend failure must NOT affect the toggle.
             */

            console.error(
                '[Push Token] ❌ Backend sync failed:',
                error
            );

        } finally {
            console.log('========================================');
            console.log('[Push Token] SYNC END');
            console.log('========================================');
        }
    };


    // ============================================================
    // DAILY REMINDER
    // ============================================================

    const handleDailyRemainder = async () => {
        console.log('');
        console.log('########################################');
        console.log('[Daily Reminder] SWITCH PRESSED');
        console.log('########################################');


        /*
         * Use the REF instead of Redux state.
         *
         * This is important for rapid taps because Redux state
         * updates don't happen synchronously.
         */

        const currentValue =
            latestDailyReminderRef.current;

        const newValue = !currentValue;


        console.log(
            '[Daily Reminder] Current value:',
            currentValue
        );

        console.log(
            '[Daily Reminder] New value:',
            newValue
        );

        console.log(
            '[Daily Reminder] Platform:',
            Platform.OS
        );

        console.log(
            '[Daily Reminder] Expo Push Token:',
            expoPushToken
        );

        console.log(
            '[Daily Reminder] Permission status:',
            permissionStatus
        );


        /*
         * --------------------------------------------------------
         * CRITICAL:
         *
         * Change the LOCAL/UI state immediately.
         *
         * We do NOT wait for:
         *
         * - permission
         * - Expo push token
         * - backend API
         * - network
         *
         * Therefore the switch always responds.
         * --------------------------------------------------------
         */

        latestDailyReminderRef.current = newValue;

        userChangedDailyReminderRef.current = true;

        dispatch(
            setDailyRemainder(newValue)
        );


        /*
         * Persist locally immediately.
         */

        try {
            await storage.set(
                STORAGE_KEY.DAILY_REMAINDER,
                newValue
            );

            console.log(
                '[Daily Reminder] ✅ Local storage updated:',
                newValue
            );

        } catch (storageError) {
            console.error(
                '[Daily Reminder] ❌ Local storage failed:',
                storageError
            );
        }


        /*
         * --------------------------------------------------------
         * TURNING OFF
         * --------------------------------------------------------
         *
         * Nothing related to push permissions is required.
         */

        if (!newValue) {
            console.log(
                '[Daily Reminder] Turning OFF locally.'
            );

            enqueueRequest(
                dailyReminderQueue,
                () => toggleDailyReminder(),
                'Daily Reminder API'
            );

            console.log(
                '[Daily Reminder] Local OFF completed.'
            );

            return;
        }


        /*
         * --------------------------------------------------------
         * TURNING ON
         * --------------------------------------------------------
         *
         * The switch is ALREADY ON at this point.
         *
         * Notification permission/token is now best-effort.
         */

        console.log(
            '[Daily Reminder] Turning ON locally.'
        );

        console.log(
            '[Daily Reminder] Checking notification permission...'
        );


        try {
            const status =
                await checkPermissionStatus();

            console.log(
                '[Daily Reminder] Permission status:',
                status
            );


            /*
             * Permission already granted.
             */

            if (status === 'granted') {
                console.log(
                    '[Daily Reminder] Permission already granted.'
                );


                /*
                 * Try syncing the existing token.
                 */

                if (expoPushToken) {
                    await syncTokenToBackend(
                        expoPushToken
                    );
                } else {
                    console.warn(
                        '[Daily Reminder] Permission granted but Expo push token is missing.'
                    );

                    console.warn(
                        '[Daily Reminder] Attempting token registration...'
                    );

                    try {
                        const result =
                            await requestPermissionAndRegister();

                        console.log(
                            '[Daily Reminder] Registration result:',
                            result
                        );

                        if (result?.token) {
                            await syncTokenToBackend(
                                result.token
                            );
                        } else {
                            console.warn(
                                '[Daily Reminder] Registration returned no token.'
                            );
                        }

                    } catch (tokenError) {
                        console.error(
                            '[Daily Reminder] Token registration failed:',
                            tokenError
                        );
                    }
                }
            }


            /*
             * Permission hasn't been requested yet.
             */

            else if (status === 'undetermined') {
                console.log(
                    '[Daily Reminder] Permission is undetermined.'
                );

                console.log(
                    '[Daily Reminder] Requesting permission and registering token...'
                );


                try {
                    const result =
                        await requestPermissionAndRegister();

                    console.log(
                        '[Daily Reminder] Permission/token result:',
                        result
                    );

                    const newStatus =
                        result?.status;

                    const token =
                        result?.token;


                    console.log(
                        '[Daily Reminder] New permission status:',
                        newStatus
                    );

                    console.log(
                        '[Daily Reminder] Generated Expo push token:',
                        token
                    );


                    if (token) {
                        await syncTokenToBackend(token);
                    } else {
                        console.warn(
                            '[Daily Reminder] ⚠️ No Expo push token generated.'
                        );
                    }


                    if (newStatus !== 'granted') {
                        console.warn(
                            '[Daily Reminder] Permission was not granted.'
                        );

                        /*
                         * DO NOT turn the switch OFF.
                         *
                         * Local preference remains ON.
                         */
                    }

                } catch (tokenError) {
                    console.error(
                        '[Daily Reminder] Permission/token registration failed:',
                        tokenError
                    );

                    /*
                     * DO NOT rollback local state.
                     */
                }
            }


            /*
             * Expo Go / simulator / unsupported environment.
             */

            else if (status === 'unavailable') {
                console.warn(
                    '[Daily Reminder] ⚠️ Push notifications are unavailable.'
                );

                console.warn(
                    '[Daily Reminder] This does NOT disable the local toggle.'
                );

                console.warn(
                    '[Daily Reminder] Platform:',
                    Platform.OS
                );

                console.warn(
                    '[Daily Reminder] Expo Push Token:',
                    expoPushToken
                );

                /*
                 * IMPORTANT:
                 *
                 * We intentionally DON'T show the blocking alert here.
                 *
                 * The user can still enable Daily Reminder locally.
                 *
                 * The actual push functionality will require a supported
                 * development/production build.
                 */
            }


            /*
             * Permission denied.
             */

            else if (status === 'denied') {
                console.warn(
                    '[Daily Reminder] Notification permission is denied.'
                );

                /*
                 * Local preference remains ON.
                 *
                 * We can ask the user to enable notifications,
                 * but we don't rollback the switch.
                 */

                pendingEnableRef.current = true;

                Alert.alert(
                    'Notifications are disabled',
                    'Daily reminder is enabled locally, but notifications are disabled. Enable notifications in your app settings to receive reminders.',
                    [
                        {
                            text: 'Later',
                            style: 'cancel',
                        },
                        {
                            text: 'Open Settings',
                            onPress: openNotificationSettings,
                        },
                    ]
                );
            }

        } catch (permissionError) {
            console.error(
                '[Daily Reminder] Permission check failed:',
                permissionError
            );

            /*
             * CRITICAL:
             *
             * Permission failure must NOT rollback the local
             * preference.
             */
        }


        /*
         * --------------------------------------------------------
         * BACKEND SYNC
         * --------------------------------------------------------
         *
         * This is intentionally independent of everything above.
         *
         * If localhost/backend is down, the switch remains ON.
         */

        enqueueRequest(
            dailyReminderQueue,
            () => toggleDailyReminder(),
            'Daily Reminder API'
        );


        console.log(
            '[Daily Reminder] ✅ Local toggle operation completed:',
            newValue
        );

        console.log('########################################');
        console.log('');
    };


    // ============================================================
    // APP STATE / RETURN FROM SETTINGS
    // ============================================================

    useEffect(() => {
        const subscription =
            AppState.addEventListener(
                'change',
                async (nextState) => {

                    console.log(
                        '[AppState] State changed:',
                        nextState
                    );

                    console.log(
                        '[AppState] Pending enable:',
                        pendingEnableRef.current
                    );


                    if (
                        nextState !== 'active' ||
                        !pendingEnableRef.current
                    ) {
                        return;
                    }


                    /*
                     * Give Android a small amount of time to update
                     * its permission state after returning from Settings.
                     */

                    await new Promise(
                        (resolve) =>
                            setTimeout(resolve, 500)
                    );


                    try {
                        const status =
                            await checkPermissionStatus();

                        console.log(
                            '[AppState] Permission after returning:',
                            status
                        );


                        if (status === 'granted') {
                            console.log(
                                '[AppState] Permission granted after Settings.'
                            );

                            pendingEnableRef.current = false;


                            try {
                                const result =
                                    await requestPermissionAndRegister();

                                console.log(
                                    '[AppState] Registration result:',
                                    result
                                );


                                if (result?.token) {
                                    await syncTokenToBackend(
                                        result.token
                                    );
                                }

                            } catch (tokenError) {
                                console.error(
                                    '[AppState] Token registration failed:',
                                    tokenError
                                );
                            }

                        } else {
                            console.warn(
                                '[AppState] Permission still not granted:',
                                status
                            );

                            /*
                             * Keep pendingEnableRef true so another
                             * Settings visit can be checked.
                             */
                        }

                    } catch (error) {
                        console.error(
                            '[AppState] Permission re-check failed:',
                            error
                        );
                    }
                }
            );


        return () => {
            subscription.remove();
        };

    }, [
        checkPermissionStatus,
        requestPermissionAndRegister,
        openNotificationSettings,
    ]);


    // ============================================================
    // REMINDER TIME
    // ============================================================

    const handleTimeChange = async (
        event,
        time
    ) => {
        setShowTimePicker(false);


        if (
            event.type !== 'set' ||
            !time
        ) {
            return;
        }


        const isoTime =
            time.toISOString();


        console.log(
            '[Reminder Time] New time:',
            isoTime
        );


        latestReminderTimeRef.current =
            isoTime;

        userChangedReminderTimeRef.current =
            true;


        setSelectedTime(time);

        dispatch(
            setRemainderTime(isoTime)
        );


        try {
            await storage.set(
                STORAGE_KEY.REMAINDER_TIME,
                isoTime
            );

            console.log(
                '[Reminder Time] Local storage updated.'
            );

        } catch (error) {
            console.error(
                '[Reminder Time] Storage update failed:',
                error
            );
        }


        enqueueRequest(
            reminderTimeQueue,
            () => updateReminderTime(isoTime),
            'Reminder Time API'
        );
    };


    // ============================================================
    // AI COACH DIGEST
    // ============================================================

    const handleAiCoachDigest = async () => {
        const currentValue =
            latestAiCoachRef.current;

        const newValue =
            !currentValue;


        console.log(
            '[AI Coach] Toggle:',
            currentValue,
            '->',
            newValue
        );


        latestAiCoachRef.current =
            newValue;

        userChangedAiCoachRef.current =
            true;


        dispatch(
            setAiCoachDigest(newValue)
        );


        try {
            await storage.set(
                STORAGE_KEY.AI_COACH,
                newValue
            );
        } catch (error) {
            console.error(
                '[AI Coach] Storage update failed:',
                error
            );
        }


        enqueueRequest(
            aiCoachQueue,
            () => toggleAiCoachDigest(),
            'AI Coach API'
        );
    };


    // ============================================================
    // MILESTONE
    // ============================================================

    const handleMileStone = async () => {
        const currentValue =
            latestMilestoneRef.current;

        const newValue =
            !currentValue;


        console.log(
            '[Milestone] Toggle:',
            currentValue,
            '->',
            newValue
        );


        latestMilestoneRef.current =
            newValue;

        userChangedMilestoneRef.current =
            true;


        dispatch(
            setMilestoneAlerts(newValue)
        );


        try {
            await storage.set(
                STORAGE_KEY.MILESTONE,
                newValue
            );
        } catch (error) {
            console.error(
                '[Milestone] Storage update failed:',
                error
            );
        }


        enqueueRequest(
            milestoneQueue,
            () => toggleMileStone(),
            'Milestone API'
        );
    };


    // ============================================================
    // UI ITEMS
    // ============================================================

    const tabItems = [
        {
            id: 'daily-remainder',
            title: 'Daily reminder',
            desc: 'Check in everyday',
            toggleBtn: true,
            Icon: Ionicons,
            iconName: 'notifications-outline',
            value: dailyRemainder,
            changeValue: handleDailyRemainder,
        },
        {
            id: 'remainder-time',
            title: 'Reminder time',
            desc: 'When to notify you',
            toggleBtn: false,
            Icon: Octicons,
            iconName: 'history',
            value: remainderTime,
            changeValue: handleTimeChange,
        },
        {
            id: 'ai-coach-digest',
            title: 'AI coach digest',
            desc: 'When to notify you',
            toggleBtn: true,
            Icon: Ionicons,
            iconName: 'sparkles-outline',
            value: aiCoachDigest,
            changeValue: handleAiCoachDigest,
        },
        {
            id: 'mile-stone-alerts',
            title: 'Mile stone alerts',
            desc: 'At 30, 60 and 90 days',
            toggleBtn: true,
            Icon: Feather,
            iconName: 'check-square',
            value: milestoneAlert,
            changeValue: handleMileStone,
        },
    ];


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <View>
            <Text style={style.componentTitle}>
                NOTIFICATIONS
            </Text>


            <View style={style.notificationContainer}>
                {tabItems.map((tab, index) => {
                    const Icon = tab.Icon;


                    return (
                        <View
                            key={tab.id}
                            style={[
                                style.notificationItem,
                                index > 0 &&
                                style.notificationItemWithBorder,
                            ]}
                        >

                            <View style={style.notification}>

                                {/* ICON */}

                                <View
                                    style={
                                        style.challengeHeadingIconContainer
                                    }
                                >
                                    <Icon
                                        name={tab.iconName}
                                        style={
                                            style.challengeHeadingIcon
                                        }
                                    />
                                </View>


                                {/* TITLE */}

                                <View
                                    style={
                                        style.challengeTitleContainer
                                    }
                                >
                                    <Text
                                        style={
                                            style.challengeTitle
                                        }
                                    >
                                        {tab.title}
                                    </Text>

                                    <Text
                                        style={
                                            style.challengeDesc
                                        }
                                    >
                                        {tab.desc}
                                    </Text>
                                </View>

                            </View>


                            {/* TOGGLE */}

                            {tab.toggleBtn ? (
                                <View
                                    style={{
                                        paddingRight: 10,
                                    }}
                                >
                                    <Switch
                                        value={!!tab.value}
                                        onValueChange={
                                            tab.changeValue
                                        }
                                        renderActiveText={false}
                                        renderInActiveText={false}
                                        circleSize={23}
                                        changeValueImmediately={true}
                                        backgroundActive={
                                            theme.primary
                                        }
                                        backgroundInactive={
                                            theme.backgroundMutedExtra
                                        }
                                        circleActiveColor={
                                            theme.background
                                        }
                                        circleInActiveColor={
                                            theme.background
                                        }
                                    />
                                </View>
                            ) : (

                                /* REMINDER TIME */

                                <View
                                    style={{
                                        paddingRight: 10,
                                    }}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() =>
                                            setShowTimePicker(true)
                                        }
                                        style={
                                            style.remainderTimeBtn
                                        }
                                    >
                                        <Text
                                            style={
                                                style.remainderValueStyle
                                            }
                                        >
                                            {tab.value
                                                ? new Date(
                                                    tab.value
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    }
                                                )
                                                : '--:--'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </View>
                    );
                })}
            </View>


            {/* TIME PICKER */}

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
    );
};


export default Notifications;
