import { StyleSheet } from "react-native";

const actionStyle = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollContent: {
        display: 'flex',
        flexDirection: "column",
        gap: 10,
        // padding: 16
    },
    headerContainer: {
        width: "100%",
        backgroundColor: theme.backgroundMuted,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderColor: theme.border,
        borderWidth: 1
    },
    headerTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text
    },
    headerDesc:{
        fontSize: 12,
        color: theme.textMuted
    },
    headerProgressBarContainer:{
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerProgressBar:{
        height: 7,
        backgroundColor: theme.backgroundMutedExtra,
        borderRadius: 5
    },
    headerProgressBarCounter:{
        fontSize: 14,
        color: theme.text,
        fontWeight: "bold"
    }
})

export default actionStyle;