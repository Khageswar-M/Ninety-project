import Constants from "expo-constants";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Linking, Platform } from "react-native";

// ---------------------------------------------------------
// IMPORTANT (SDK 53+)
// Remote push notifications are not supported in Expo Go. Use a
// development build to register for remote push notifications.
//
// expo-notifications is loaded dynamically so Expo Go can
// still run the app on Android without crashing.
// ---------------------------------------------------------

const isExpoGo = Constants.appOwnership === "expo";
const isAndroidExpoGo = Platform.OS === "android" && isExpoGo;

let Notifications = null;
let notificationsLoadPromise = null;

const loadNotifications = async () => {
  if (Notifications) return Notifications;
  if (isAndroidExpoGo) return null;

  // Guard against concurrent dynamic-import calls (e.g. the two
  // effects below both firing on mount) creating two module
  // instances / double-registering the handler.
  if (!notificationsLoadPromise) {
    notificationsLoadPromise = (async () => {
      const module = await import("expo-notifications");
      Notifications = module;

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // Create the Android channel as soon as the module is
      // available, not only right before fetching a token.
      // A channel must exist before a notification using it can
      // be displayed, and creating it early avoids a race where
      // a notification could arrive before getExpoToken() runs.
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return Notifications;
    })();
  }

  return notificationsLoadPromise;
};

// ---------------------------------------------------------
// Get Expo Push Token
// ---------------------------------------------------------

const getExpoToken = async () => {
  const NotificationsModule = await loadNotifications();
  if (!NotificationsModule) return { token: null, error: null };

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    // Swallowing this used to just print to the console and
    // return null, which looks identical to "permission denied"
    // from the caller's point of view. Surface it distinctly so
    // a missing/misconfigured EAS projectId doesn't get mistaken
    // for a permissions problem.
    const error = new Error(
      "Missing EAS projectId (app.json > extra.eas.projectId). " +
      "getExpoPushTokenAsync cannot generate a token without it."
    );
    console.error(error.message);
    return { token: null, error };
  }

  try {
    const token = await NotificationsModule.getExpoPushTokenAsync({
      projectId,
    });
    return { token: token.data, error: null };
  } catch (err) {
    console.error("Error getting Expo push token:", {
      name: err?.name ?? "Error",
      message: err?.message ?? String(err),
      code: err?.code,
      stack: err?.stack,
    });
    return { token: null, error: err };
  }
};

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------

export const usePushNotifications = ({ onTokenChange } = {}) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  const router = useRouter();

  const isNavigatingRef = useRef(false);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const pushTokenListener = useRef(null);

  // Kept in a ref so effects don't need onTokenChange in their
  // dependency arrays (callers rarely memoize inline functions).
  const onTokenChangeRef = useRef(onTokenChange);
  onTokenChangeRef.current = onTokenChange;

  // Your backend (ExpoNotificationServiceImpl) reads the token off
  // Settings.expoPushToken — this hook only ever *generates* a
  // token locally. Something has to PUT it to your Settings
  // endpoint, or the backend's copy is null/stale and every send
  // silently has nowhere to go. Pass an onTokenChange callback
  // (e.g. `(token) => api.put("/settings", { expoPushToken: token })`)
  // and it fires any time a token is issued or rotated.
  const notifyTokenChange = useCallback((token) => {
    if (!token) return;
    Promise.resolve(onTokenChangeRef.current?.(token)).catch((err) => {
      console.error("Failed to sync push token with backend:", err);
    });
  }, []);

  // -------------------------------------------------------
  // Check permission
  // -------------------------------------------------------

  const checkPermissionStatus = useCallback(async () => {
    if (isExpoGo) {
      setPermissionStatus("unavailable");
      return "unavailable";
    }

    if (!Device.isDevice) {
      // Simulators/emulators can't register for remote push at
      // all. Using a distinct status (rather than "denied") stops
      // the UI from showing an "open settings" prompt that can't
      // fix anything here.
      setPermissionStatus("unavailable");
      return "unavailable";
    }

    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      setPermissionStatus("unavailable");
      return "unavailable";
    }

    const { status } = await NotificationsModule.getPermissionsAsync();
    setPermissionStatus(status);
    return status;
  }, []);

  // -------------------------------------------------------
  // Request permission + register
  // -------------------------------------------------------

  const requestPermissionAndRegister = useCallback(async () => {
    if (isExpoGo) {
      setPermissionStatus("unavailable");
      return { status: "unavailable", token: null };
    }

    if (!Device.isDevice) {
      setPermissionStatus("unavailable");
      return { status: "unavailable", token: null };
    }

    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      setPermissionStatus("unavailable");
      return { status: "unavailable", token: null };
    }

    const { status: existingStatus } =
      await NotificationsModule.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus === "undetermined") {
      const { status } = await NotificationsModule.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermissionStatus(finalStatus);

    if (finalStatus !== "granted") {
      return { status: finalStatus, token: null };
    }

    const { token, error } = await getExpoToken();
    setExpoPushToken(token);
    setTokenError(error);
    notifyTokenChange(token);

    return { status: finalStatus, token, error };
  }, [notifyTokenChange]);

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

  // -------------------------------------------------------
  // App opened from killed state
  // -------------------------------------------------------

  const checkForInitialNotification = useCallback(async () => {
    try {
      const NotificationsModule = await loadNotifications();
      if (!NotificationsModule) return;

      const response =
        await NotificationsModule.getLastNotificationResponseAsync();
      if (!response) return;

      await handleNotificationResponse(response);
      await NotificationsModule.clearLastNotificationResponseAsync();
    } catch (error) {
      console.error("Error checking initial notification:", error);
    }
  }, [handleNotificationResponse]);

  // -------------------------------------------------------
  // Read permission on mount, fetch token if already granted
  // -------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    checkPermissionStatus().then(async (status) => {
      if (status === "granted" && mounted) {
        const { token, error } = await getExpoToken();
        if (mounted) {
          setExpoPushToken(token);
          setTokenError(error);
          notifyTokenChange(token);
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [checkPermissionStatus, notifyTokenChange]);

  // -------------------------------------------------------
  // Register notification listeners
  // -------------------------------------------------------

  useEffect(() => {
    if (isAndroidExpoGo) return;

    let mounted = true;

    const setupListeners = async () => {
      const NotificationsModule = await loadNotifications();
      if (!NotificationsModule || !mounted) return;

      await checkForInitialNotification();

      notificationListener.current =
        NotificationsModule.addNotificationReceivedListener(
          (_notification) => {
            // Optional: react to notifications received while the
            // app is in the foreground.
          }
        );

      responseListener.current =
        NotificationsModule.addNotificationResponseReceivedListener(
          handleNotificationResponse
        );

      // Expo/FCM/APNs can reissue a token behind the scenes (app
      // reinstall, credential rotation, etc). Without this listener
      // the app keeps the old token in state and your backend's
      // Settings.expoPushToken silently goes stale — sends still
      // "succeed" against Expo's API but never reach the device.
      pushTokenListener.current = NotificationsModule.addPushTokenListener(
        (tokenData) => {
          setExpoPushToken(tokenData.data);
          notifyTokenChange(tokenData.data);
        }
      );
    };

    setupListeners();

    return () => {
      mounted = false;
      notificationListener.current?.remove();
      responseListener.current?.remove();
      pushTokenListener.current?.remove();
      notificationListener.current = null;
      responseListener.current = null;
      pushTokenListener.current = null;
    };
  }, [handleNotificationResponse, checkForInitialNotification, notifyTokenChange]);

  // -------------------------------------------------------
  // Return API
  // -------------------------------------------------------

  return {
    expoPushToken,
    permissionStatus,
    tokenError,
    checkPermissionStatus,
    requestPermissionAndRegister,
    openNotificationSettings,
  };
};