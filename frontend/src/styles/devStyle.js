import { StyleSheet } from "react-native";
import { Fonts } from "../constants/Fonts";

const devStyles = (theme) => StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: theme.background,
    }
})

export default devStyles;