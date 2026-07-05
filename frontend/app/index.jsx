import { Text, View } from "react-native";
import { useThemeStyles } from "../src/hook/useThemeStyles.js";
import SplashScreen from '../src/components/splash/SplashScreen.jsx'

export default function Index() {
  const style = useThemeStyles();
  return (
    <View style={style.mainContainer}>
      <SplashScreen/>
    </View>
  );
}
