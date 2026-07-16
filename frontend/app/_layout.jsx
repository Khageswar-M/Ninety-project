import { Stack } from "expo-router";
import { store } from "../src/redux/store";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SplashScreenPage from '../src/components/splash/SplashScreen.jsx';
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

function AppNavigation() {

  const [isReady, setIsRead] = useState(false);
  const isDarkMode = useSelector((state) => state.theme.isDark);
  const theme = useSelector((state) => state.theme.theme);
  const inset = useSafeAreaInsets();

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

  if (!isReady) return (<SplashScreenPage />)

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
        />

        <Stack.Screen
          name="editProfilePage"
        />

        <Stack.Screen
          name="privacyPolicy"
        />

        <Stack.Screen
          name="rateApp"
        />

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
