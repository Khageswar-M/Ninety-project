import { StyleSheet } from "react-native";
import { Fonts } from "../constants/Fonts";

const settingsStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    containerContentStyle: {
        flexDirection: 'column',
        gap: 10,
        paddingBottom: 100,
        flexGrow: 1,
        backgroundColor: theme.background
    },
    componentContainer: {
        flexDirection: 'column',
        gap: 5
    },
    componentTitle: {
        color: theme.textMuted,
        fontSize: 12,
        marginBottom: 5
    },
    headerContainer: {
        paddingHorizontal: 0
    },
    headerContainerPadding:{
        paddingHorizontal: 10
    },
    header: {
        backgroundColor: theme.backgroundMuted,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTextContainer: {
        flexDirection: 'column',
        gap: 3
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text,
    },
    headerDesc: {
        fontSize: 14,
        color: theme.textMuted
    },
    profileContainer:{
        backgroundColor: theme.backgroundMuted,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,

    },
    profileLeft:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    profileDp:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background,
        height: 50,
        width: 50,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.border
    },
    profileDpLetters:{
        color: theme.border,
        fontSize: 18,
        fontWeight: 'bold'
    },
    userContainer:{
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        flexShrink: 1,
    },
    userName:{
        fontSize: 16,
        color: theme.text,
        flexShrink: 1,
    },
    userEmail:{
        fontSize: 13,
        color: theme.textMuted,
        flexShrink: 1,
    },
    userAchievement:{
        backgroundColor: theme.success,
        alignSelf: 'flex-start',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        borderWidth: 1,
        borderColor: '#69ff38'
    },
    userAchievementTitle:{
        fontSize: 12,
        fontWeight: '300',
        color: '#69ff38'
    },
    trophy:{
        fontSize: 16,
        color: '#69ff38'
    },
    editBtn:{
        backgroundColor:theme.background,
        padding: 9,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border
    },
    editBtnIcon:{
        fontSize: 16,
        color: theme.text,
    },
    editProfileContainer:{
        flex: 1,
        // backgroundColor: theme.background
    },
    editProfilePage:{
        flex: 1,
        backgroundColor: theme.background
    }
})

export default settingsStyles;