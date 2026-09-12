import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";
import { CustomToast } from "../src/components/common/CustomToast.jsx";
import { NetworkProvider } from "../src/components/network/NetworkProvider.jsx";
import SplashScreenPage from '../src/components/splash/SplashScreen.jsx';
import { hydrateApp } from "../src/redux/slices/appSlice.js";
import { setDarkTheme, setLightTheme } from "../src/redux/slices/themeSlice.js";
import { store } from "../src/redux/store";
import { storage } from "../src/utils/storage.js";

SplashScreen.preventAutoHideAsync();

function AppNavigation() {

  const dispatch = useDispatch();


  const isDarkMode = useSelector((state) => state.theme.isDark);
  const isLoggedIn = useSelector((state) => state.app.isLogin);
  const colorScheme = useColorScheme();

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);


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

        console.log("Current time:", Date.now());
        console.log("Token expires at:", storedUser.tokenExpiresAt);
        console.log("Token expired:", isTokenExpired);

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
        console.error("Failed to hydrate app:", error);

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

        const pastTheme = await storage.get("darkTheme");

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
        console.error("Failed to load theme:", error);
      }

    };

    loadTheme();

  }, [colorScheme, dispatch]);

  // Upload Font
  const [loaded] = useFonts({
    "Poppins-regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "GoogleSans-regular": require("../assets/fonts/GoogleSans-Regular.ttf")
  });


  // Minimum splash display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDelayDone(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded || !isAuthReady) {
      return;
    }

    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplash();

  }, [loaded, isAuthReady]);

  if (!loaded || !isAuthReady || !minDelayDone) {
    // if (true) {
    return <SplashScreenPage />;
  }




  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          presentation: "transparentModal"
        }}
      >
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="(subScreens)"
            options={{
              animation: 'fade',
              presentation: "transparentModal"
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="(auth)"
            options={{
              animation: "fade",
              presentation: "transparentModal"
            }}
          />
        </Stack.Protected>
      </Stack>
    </>
  )
};

export default function RootLayout() {
  const toastConfig = {
    error: (props) => (
      <CustomToast {...props} />
    ),
  }
  return (
    <Provider store={store}>
      <NetworkProvider>
        <AppNavigation />
        <Toast config={toastConfig} />
      </NetworkProvider>
    </Provider>
  );
}