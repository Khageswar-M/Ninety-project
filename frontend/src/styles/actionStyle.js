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
        
    },
    cellChecked:{
        borderColor: theme.light,
        borderWidth: 0.5,
    },
    cellNotChecked:{
        borderColor: theme.danger,
        borderWidth: 0.2,
    },
    cellWillCheckToday:{
        borderColor: theme.successLight,
        borderWidth: 0.2,
    },
    cellWillCheck:{
        borderColor: theme.backgroundMutedExtra,
        borderWidth: 0.2,
    },
    collIndexText:{
        color: theme.text,
        fontWeight: 'bold',
        fontFamily: Fonts.poppins,
        fontSize: 10
    },
    lastCheckContainer:{
        flexDirection: 'row',
        gap: 5,
        marginTop: 4,
        alignItems: 'center'
    },
    lastCheck:{
        fontSize: 12,
        fontFamily: Fonts.poppins,
        color: theme.successLight,
        fontWeight: 'bold'
    },
    addBtn:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primary,
        padding: 12,
        borderRadius: 50,
        alignSelf: 'flex-start',
        gap: 5
    },
    addBtnTitle:{
        fontWeight: 'bold',
        fontSize: 20,
        color: theme.text
    },
    goalsAddInputContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20,
    },
    goalsAddInput:{
        borderColor: '#ff7b005f',
        borderWidth: 3,
        width: '70%',
        borderRadius: 5,
    },
    goalsAddInputFocused:{
        borderColor: theme.primary,
    }
})

export default actionStyle;