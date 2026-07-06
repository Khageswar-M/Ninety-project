import { StyleSheet } from "react-native";
import { Fonts } from "../constants/Fonts";

const styles = (theme) => StyleSheet.create({
    mainContainer: {
        backgroundColor: theme.background,
        flex: 1
    },
    container: { 
        flex: 1,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingVertical: 60
    },
    logoContainer: {
       width: 145,
       height: 160,
       flexDirection: "row",
       flexWrap: "wrap",
       borderRadius: 4,
       alignItems: 'center',
       justifyContent: 'center'
    },
    box: {
        height: 12,
        width: 12,
        backgroundColor: theme.dark,
        borderRadius: 2,
        margin: 2,
        borderWidth: 0.2,
        borderColor: theme.border
    },
    activeBox: {
        backgroundColor: theme.primary,
    },
    logoTitle:{
        fontSize: 40,
        color: theme.text,
        textAlign: 'center',
        fontFamily: Fonts.poppins
    },
    titleUnderline:{
        height: 3,
        backgroundColor: theme.primary,
        borderRadius: 10,
        width: 80,
        margin: 'auto',
        marginTop: 3
    },
    versionTitle: {
        color: theme.backgroundMutedExtra
    },
    moto: {
        fontSize: 12,
        color: theme.text,
        textAlign: 'center',
        marginTop: 5
    },
    loading: {
        height: 3,
        backgroundColor: theme.primary,
        width: 150,
        borderRadius: 10,   
    },
    loadingTitleUnderline: {
        color: theme.backgroundMutedExtra,
        fontSize: 10,
        textAlign: 'center',
        marginTop: 3
    }, 
    tabBar:{
        backgroundColor: theme.background,
    },
    tabBarActiveTextColor: {
        color: theme.text
    }
});

export default styles;