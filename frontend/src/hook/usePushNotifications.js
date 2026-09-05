import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Linking, Platform } from "react-native";

// IMPORTANT: Configure notification presentation globally.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const getExpoToken = async () => {
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token.data;
  } catch (err) {
    console.error("Error getting Expo push token:", err);
    return null;
  }
};

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null); // "granted" | "denied" | "undetermined"

  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  // Read current OS permission WITHOUT prompting
  const checkPermissionStatus = useCallback(async () => {
    if (!Device.isDevice) return "denied";
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
    return status;
  }, []);

  // Only shows an OS prompt if status is "undetermined" (first time ever asked).
  // If already "denied", this silently returns "denied" again — OS restriction, not a bug.
  const requestPermissionAndRegister = useCallback(async () => {
    if (!Device.isDevice) return { status: "denied", token: null };

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus === "undetermined") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermissionStatus(finalStatus);

    if (finalStatus !== "granted") return { status: finalStatus, token: null };

    const token = await getExpoToken();
    setExpoPushToken(token);
    return { status: finalStatus, token };
  }, []);

  // Deep-link straight to this app's notification settings page
  const openNotificationSettings = useCallback(() => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }, []);

  // ---------------- HANDLE TAP ----------------
  // Backend sends: Map.of("screen", "/(tabs)/ActionsScreen") as the `data` payload
  const handleNotificationResponse = useCallback(
    async (response) => {
      if (isNavigatingRef.current) return;

      const data = response?.notification?.request?.content?.data;

      if (!data?.screen) return;

      isNavigatingRef.current = true;

      try {
        router.push({
          pathname: data.screen,
          params: data.params ? { ...data.params } : {},
        });
      } catch (error) {
        console.error("Error handling notification tap:", error);
      } finally {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 1000);
      }
    },
    [router]
  );

  // ---------------- APP OPENED FROM KILLED STATE VIA NOTIFICATION TAP ----------------
  const checkForInitialNotification = useCallback(async () => {
    try {
      const response = await Notifications.getLastNotificationResponseAsync();

      if (!response) return;

      await handleNotificationResponse(response);

      // Don't process the same notification again on next mount
      await Notifications.clearLastNotificationResponseAsync();
    } catch (error) {
      console.error("Error checking initial notification:", error);
    }
  }, [handleNotificationResponse]);

  // On mount, just READ permission status (no prompt) — if already granted, fetch the token
  useEffect(() => {
    checkPermissionStatus().then((status) => {
      if (status === "granted") getExpoToken().then(setExpoPushToken);
    });
  }, [checkPermissionStatus]);

  // Register listeners: foreground receive + tap response + killed-state initial tap
  useEffect(() => {
    checkForInitialNotification();

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Optional: react to a notification arriving while app is open (e.g. refresh a badge)
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [handleNotificationResponse, checkForInitialNotification]);

  return {
    expoPushToken,
    permissionStatus,
    checkPermissionStatus,
    requestPermissionAndRegister,
    openNotificationSettings,
  };
};