import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import SplashScreenPage from '../src/components/splash/SplashScreen.jsx';
import { hydrateApp } from "../src/redux/slices/appSlice.js";
import { setDarkTheme, setLightTheme } from "../src/redux/slices/themeSlice.js";
import { store } from "../src/redux/store";
import { storage } from "../src/utils/storage.js";
import { NetworkProvider } from "../src/components/network/NetworkProvider.jsx";
SplashScreen.preventAutoHideAsync();
// import '../src/local_notifications/NotificationHandler'

function AppNavigation() {

  const dispatch = useDispatch();

  // const [isReady, setIsRead] = useState(false);
  const isDarkMode = useSelector((state) => state.theme.isDark);
  const isLoggedIn = useSelector((state) => state.app.isLogin);
  // const theme = useSelector((state) => state.theme.theme);
  // const inset = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const [isAuthReady, setIsAuthReady] = useState(false);
  // const [isSplashReady, setIsSplashReady] = useState(false);

  // storage.clear();

  // App initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedUser = await storage.get("@ninety_user");

        console.log("Stored user:", storedUser);

        if (!storedUser?.jwtToken || !storedUser?.tokenExpiresAt) {
          await storage.remove("@ninety_user");

          dispatch(
            hydrateApp({
              isLogin: false,
            })
          );

          return;
        }

        const isTokenExpired =
          Date.now() >= storedUser.tokenExpiresAt;

        console.log(
          "Current time:",
          Date.now()
        );

        console.log(
          "Token expires at:",
          storedUser.tokenExpiresAt
        );

        console.log(
          "Token expired:",
          isTokenExpired
        );

        if (isTokenExpired) {
          console.log("JWT token has expired.");

          await storage.remove("@ninety_user");

          dispatch(
            hydrateApp({
              isLogin: false,
            })
          );

          return;
        }

        // Token is still valid
        dispatch(
          hydrateApp({
            isLogin: true,
          })
        );

      } catch (error) {
        console.error(
          "Failed to hydrate app:",
          error
        );

        dispatch(
          hydrateApp({
            isLogin: false,
          })
        );

      } finally {
        setIsAuthReady(true);
      }
    };

    initializeApp();

  }, [dispatch]);

  // Theme
  useEffect(() => {

    const loadTheme = async () => {

      try {

        const pastTheme =
          await storage.get("darkTheme");

        switch (pastTheme) {

          case "dark":
            dispatch(setDarkTheme());
            break;

          case "light":
            dispatch(setLightTheme());
            break;

          case "system":
            colorScheme === "dark"
              ? dispatch(setDarkTheme())
              : dispatch(setLightTheme());
            break;

          default:
            colorScheme === "dark"
              ? dispatch(setDarkTheme())
              : dispatch(setLightTheme());
        }

      } catch (error) {

        console.error(
          "Failed to load theme:",
          error
        );

      }

    };

    loadTheme();

  }, [colorScheme, dispatch]);

  // Upload Font
  const [loaded] = useFonts({
    "Poppins-regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "GoogleSans-regular": require("../assets/fonts/GoogleSans-Regular.ttf")
  });

  useEffect(() => {
    if (!loaded || !isAuthReady) {
      return;
    }

    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplash();

  }, [loaded, isAuthReady]);

  if (!loaded || !isAuthReady) {
    return <SplashScreenPage />;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(subScreens)" />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  )
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      {/* <NetworkProvider> */}
      <AppNavigation />
      {/* </NetworkProvider> */}
    </Provider>
  );
}
