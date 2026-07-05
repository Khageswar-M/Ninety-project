import { Stack } from "expo-router";
import { store } from "../src/redux/store";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";

function AppNavigation() {
  const isDarkMode = useSelector((state) => state.theme.isDark);

  // Upload Font
  const [loaded] = useFonts({
    "Poppins-regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "GoogleSans-regular": require("../assets/fonts/GoogleSans-Regular.ttf")
  });
  if(!loaded) return null;
  
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
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
