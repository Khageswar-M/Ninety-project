import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export const usePushNotifications = () => {

    // Notification handler
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldSetBadge: true,
            shouldShowBanner: true
        })
    })

    // -------------- STATES-REFS -----------------------

    // Stores the device's Expo push token
    const [expoPushToken, setExpoPushToken] = useState();

    // keep track of the latest received notifications
    const [notification, setNotification] = useState();

    // help subscribe to notification events
    const notificationListener = useRef();
    const responseListener = useRef();

    // prevent duplicate navigation's when a notification is tapped
    const isNavigatingRef = useRef(false);

    const router = useRouter();

    // ----------- REG-DEVICE -------------

    async function registerForPushNotificationsAsync() {
        let token;

        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                return;
            }

            try {
                token = await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig?.extra?.eas?.projectId,
                });
            } catch (error) {
                console.error("Error getting push token:", error);
                return;
            }

            // instructions for how android should handle notifications
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C'
                });
            }

            return token;
        }
    }

    /**
     * Assumption: The notification payload should have this structure:
     * {
     *      data:{
     *          screen: "/screen",  // the target screen path
     *          params: { ... }     // optional params to pass to the screen
     *      }
     * }
     */

    // ---------- HANDLE NOTIFICATION ----------
    const handleNotificationResponse = useCallback(async (response) => {
        // prevent multiple navigation's
        if (isNavigatingRef.current) return;

        const data = response.notification.request.content.data;

        if (!data?.screen) return;

        isNavigatingRef.current = true;

        try {
            router.push({
                pathname: data.screen,
                params: { ...data.params },
            });
        } catch (error) {
            console.error("Error handling notification tap:", error);
        } finally {
            // Reset a flag after a short delay
            setTimeout(() => {
                isNavigatingRef.current = false;
            }, 1000);
        }

    }, [router]);

    const checkForInitialNotification = useCallback(async () => {
        try {
            const response =
                await Notifications.getLastNotificationResponseAsync()

            if (!response) return;

            await handleNotificationResponse(response);
        } catch (error) {
            console.error(
                "Error checking initial notification: ",
                error
            );
        }
    }, [handleNotificationResponse])

    useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
        setExpoPushToken(token);
    });

    checkForInitialNotification();

    notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

    responseListener.current =
        Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse
        );

    return () => {
        notificationListener.current?.remove();
        responseListener.current?.remove();
    };
}, [handleNotificationResponse, checkForInitialNotification]);


    return {
        expoPushToken,
        notification
    }
}