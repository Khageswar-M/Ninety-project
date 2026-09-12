import Constants from "expo-constants";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Linking, Platform } from "react-native";

// ---------------------------------------------------------
// IMPORTANT
// Android remote push notifications are NOT supported in
// Expo Go. They require a development build.
//
// We dynamically load expo-notifications only when it is
// actually needed, so Expo Go can still run the application.
// ---------------------------------------------------------

const isExpoGo = Constants.appOwnership === "expo";

let Notifications = null;

const loadNotifications = async () => {
  if (Notifications) {
    return Notifications;
  }

  // Android Expo Go does not support remote push notifications.
  if (Platform.OS === "android" && isExpoGo) {
    return null;
  }

  const module = await import("expo-notifications");
  Notifications = module;

  // Configure notification presentation globally.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return Notifications;
};

// ---------------------------------------------------------
// Get Expo Push Token
// ---------------------------------------------------------

const getExpoToken = async () => {
  try {
    const NotificationsModule = await loadNotifications();

    if (!NotificationsModule) {
      return null;
    }

    const token = await NotificationsModule.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    if (Platform.OS === "android") {
      await NotificationsModule.setNotificationChannelAsync("default", {
        name: "default",
        importance: NotificationsModule.AndroidImportance.MAX,
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

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const router = useRouter();

  const isNavigatingRef = useRef(false);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  // -------------------------------------------------------
  // Check permission
  // -------------------------------------------------------

  const checkPermissionStatus = useCallback(async () => {
    // Android Expo Go cannot use remote notifications.
    if (Platform.OS === "android" && isExpoGo) {
      setPermissionStatus("unavailable");
      return "unavailable";
    }

    if (!Device.isDevice) {
      setPermissionStatus("denied");
      return "denied";
    }

    const NotificationsModule = await loadNotifications();

    if (!NotificationsModule) {
      setPermissionStatus("unavailable");
      return "unavailable";
    }

    const { status } =
      await NotificationsModule.getPermissionsAsync();

    setPermissionStatus(status);

    return status;
  }, []);

  // -------------------------------------------------------
  // Request permission + register
  // -------------------------------------------------------

  const requestPermissionAndRegister = useCallback(async () => {
    // Android Expo Go cannot register remote push notifications.
    if (Platform.OS === "android" && isExpoGo) {
      setPermissionStatus("unavailable");

      return {
        status: "unavailable",
        token: null,
      };
    }

    if (!Device.isDevice) {
      setPermissionStatus("denied");

      return {
        status: "denied",
        token: null,
      };
    }

    const NotificationsModule = await loadNotifications();

    if (!NotificationsModule) {
      setPermissionStatus("unavailable");

      return {
        status: "unavailable",
        token: null,
      };
    }

    const { status: existingStatus } =
      await NotificationsModule.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus === "undetermined") {
      const { status } =
        await NotificationsModule.requestPermissionsAsync();

      finalStatus = status;
    }

    setPermissionStatus(finalStatus);

    if (finalStatus !== "granted") {
      return {
        status: finalStatus,
        token: null,
      };
    }

    const token = await getExpoToken();

    setExpoPushToken(token);

    return {
      status: finalStatus,
      token,
    };
  }, []);

  // -------------------------------------------------------
  // Open notification settings
  // -------------------------------------------------------

  const openNotificationSettings = useCallback(() => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }, []);

  // -------------------------------------------------------
  // Handle notification tap
  // -------------------------------------------------------

  const handleNotificationResponse = useCallback(
    async (response) => {
      if (isNavigatingRef.current) {
        return;
      }

      const data =
        response?.notification?.request?.content?.data;

      if (!data?.screen) {
        return;
      }

      isNavigatingRef.current = true;

      try {
        router.push({
          pathname: data.screen,
          params: data.params ? { ...data.params } : {},
        });
      } catch (error) {
        console.error(
          "Error handling notification tap:",
          error
        );
      } finally {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 1000);
      }
    },
    [router]
  );

  // -------------------------------------------------------
  // App opened from killed state
  // -------------------------------------------------------

  const checkForInitialNotification = useCallback(async () => {
    try {
      const NotificationsModule = await loadNotifications();

      if (!NotificationsModule) {
        return;
      }

      const response =
        await NotificationsModule.getLastNotificationResponseAsync();

      if (!response) {
        return;
      }

      await handleNotificationResponse(response);

      await NotificationsModule.clearLastNotificationResponseAsync();
    } catch (error) {
      console.error(
        "Error checking initial notification:",
        error
      );
    }
  }, [handleNotificationResponse]);

  // -------------------------------------------------------
  // Read permission on mount
  // -------------------------------------------------------

  useEffect(() => {
    checkPermissionStatus().then((status) => {
      if (status === "granted") {
        getExpoToken().then(setExpoPushToken);
      }
    });
  }, [checkPermissionStatus]);

  // -------------------------------------------------------
  // Register notification listeners
  // -------------------------------------------------------

  useEffect(() => {
    // Nothing to do in Android Expo Go.
    if (Platform.OS === "android" && isExpoGo) {
      return;
    }

    let mounted = true;

    const setupListeners = async () => {
      const NotificationsModule = await loadNotifications();

      if (!NotificationsModule || !mounted) {
        return;
      }

      await checkForInitialNotification();

      notificationListener.current =
        NotificationsModule.addNotificationReceivedListener(
          (notification) => {
            // Optional:
            // React to notifications received while app
            // is in the foreground.
          }
        );

      responseListener.current =
        NotificationsModule.addNotificationResponseReceivedListener(
          handleNotificationResponse
        );
    };

    setupListeners();

    return () => {
      mounted = false;

      notificationListener.current?.remove();
      responseListener.current?.remove();

      notificationListener.current = null;
      responseListener.current = null;
    };
  }, [
    handleNotificationResponse,
    checkForInitialNotification,
  ]);

  // -------------------------------------------------------
  // Return API
  // -------------------------------------------------------

  return {
    expoPushToken,
    permissionStatus,
    checkPermissionStatus,
    requestPermissionAndRegister,
    openNotificationSettings,
  };
};
