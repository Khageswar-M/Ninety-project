import { Stack } from "expo-router";
import { store } from "../src/redux/store";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SplashScreen from '../src/components/splash/SplashScreen.jsx';


function AppNavigation() {
  const isDarkMode = useSelector((state) => state.theme.isDark);
  const theme = useSelector((state) => state.theme.theme);
  const inset = useSafeAreaInsets();

  // Upload Font
  const [loaded] = useFonts({
    "Poppins-regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "GoogleSans-regular": require("../assets/fonts/GoogleSans-Regular.ttf")
  });
  if (!loaded) return null;

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
          options={{
            animation: 'slide_from_right',
          }}
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
