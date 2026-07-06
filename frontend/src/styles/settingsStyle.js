import { StyleSheet } from "react-native";
import { Fonts } from "../constants/Fonts";

const settingsStyles = (theme) => StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: theme.background,
    }
})

export default settingsStyles;