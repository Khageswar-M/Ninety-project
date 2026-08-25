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
SplashScreen.preventAutoHideAsync();
// import '../src/local_notifications/NotificationHandler'

function AppNavigation() {

  const dispatch = useDispatch();

  const [isReady, setIsRead] = useState(false);
  const isDarkMode = useSelector((state) => state.theme.isDark);
  const isLoggedIn = useSelector((state) => state.app.isLogin);
  const theme = useSelector((state) => state.theme.theme);
  const inset = useSafeAreaInsets();
  const colorScheme = useColorScheme();


  // App initialization
  useEffect(() => {

    const initializeApp = async () => {

      try {

        const storedUser =
          await storage.get("@ninety_user");

        if (!storedUser) {

          dispatch(
            hydrateApp({
              isLogin: false
            })
          );

          return;
        }

        const challenge =
          storedUser?.challenges?.[0]; 

        dispatch(

          hydrateApp({

            isLogin:
              Boolean(storedUser?.jwtToken),

            dayGrid:
              challenge?.dayGrid ?? [],

            gridId:
              challenge?.id ?? 0,

            currentDay:
              challenge?.currentDay ?? 0,

            completedCount:
              challenge?.completedCount ?? 0,

            currentStreak:
              challenge?.currentStreakCount ?? 0,

            missedDaysCount: 0,
            successRate: 0,
            bestStreak: 0
          })
        );
      } catch (error) {

        console.error(
          "Failed to hydrate app:",
          error
        );

        dispatch(

          hydrateApp({
            isLogin: false
          })
        );

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
    async function prepare() {
      if (!loaded) return;

      await new Promise(resolve => setTimeout(resolve, 3000));

      setIsRead(true);
      await SplashScreen.hideAsync();
    }

    prepare();
  }, [loaded]);

  if (!isReady) return (<SplashScreenPage />);

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
      <AppNavigation />
    </Provider>
  );
}
