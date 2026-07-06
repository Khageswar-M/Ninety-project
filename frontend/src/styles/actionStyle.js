import { StyleSheet } from "react-native";
import { Fonts } from "../constants/Fonts";

const actionStyle = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollContent: {
        display: 'flex',
        flexDirection: "column",
        // gap: 5,
        // padding: 16
    },
    headerParent:{
        padding: 10
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
    barContainer:{
        width: '85%',
        alignItems: 'center'
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
    },
    boardTitle:{
        color: theme.textMuted,
        fontSize: 12,
        marginBottom: 5
    },
    boardContainer:{
        backgroundColor: theme.backgroundMuted,
        padding: 10,
        borderRadius: 10,
        borderColor: theme.border,
        borderWidth: 1,
        gap: 6,
        width: '100%'
    },
    row:{
        flexDirection: 'row',
        gap: 6,
        width: '100%'
    },
    coll:{
        flex: 1,
        aspectRatio: 1,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: theme.border,
        borderWidth: 0.2
    },
    collIndexText:{
        color: theme.text,
        fontWeight: 'bold',
        fontFamily: Fonts.poppins
    }
})

export default actionStyle;