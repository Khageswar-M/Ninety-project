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
    headerContainerPadding: {
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
    profileContainer: {
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
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    profileDp: {
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
    profileDpLetters: {
        color: theme.border,
        fontSize: 18,
        fontWeight: 'bold'
    },
    userContainer: {
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        flexShrink: 1,
    },
    userName: {
        fontSize: 16,
        color: theme.text,
        flexShrink: 1,
    },
    userEmail: {
        fontSize: 13,
        color: theme.textMuted,
        flexShrink: 1,
    },
    userAchievement: {
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
    userAchievementTitle: {
        fontSize: 12,
        fontWeight: '300',
        color: '#69ff38'
    },
    trophy: {
        fontSize: 16,
        color: '#69ff38'
    },
    editBtn: {
        backgroundColor: theme.background,
        padding: 9,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border
    },
    editBtnIcon: {
        fontSize: 16,
        color: theme.text,
    },
    editProfileContainer: {
        flex: 1,
    },
    editProfilePage: {
        flex: 1,
        backgroundColor: theme.background
    },
    challengeContainer: {
        backgroundColor: theme.backgroundMuted,
        flexDirection: 'column',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
        gap: 10
    },
    challengeHeadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    challengeHeadingIconContainer: {
        backgroundColor: theme.text,
        borderRadius: 5,
    },
    challengeHeadingIcon: {
        fontSize: 20,
        padding: 10,
        color: theme.primary
    },
    challengeTitleContainer: {
        flexDirection: 'column',
        gap: 2
    },
    challengeTitle: {
        color: theme.text,
        fontWeight: 'bold',
        fontSize: 16
    },
    challengeDesc: {
        color: theme.textMuted,
        fontSize: 12,
        fontWeight: "300"
    },
    progressBarContainer: {
        flexDirection: 'column',
        gap: 5,
        paddingHorizontal: 10,
    },
    progressBarTitlesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    progressBarTitle: {
        fontSize: 14,
        fontWeight: '300',
        color: theme.text
    },
    progressBar: {
        height: 7,
        backgroundColor: theme.background,
        width: '100%',
        borderRadius: 10
    },
    progressBarRemainingTitles: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    progressBarRemainingTitleLeft: {
        fontSize: 12,
        fontWeight: '400',
        color: theme.textMuted
    },
    progressBarRemainingTitleRight: {
        color: theme.primary
    },
    resetChallengeWrapper: {
        borderTopWidth: 1,
        borderColor: theme.border,
    },
    resetChallengeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'space-between',
    },
    resetChallengeBoard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        position: 'relative'
    },
    resetIcon: {
        fontSize: 30,
        padding: 5,
        color: theme.primary,
        fontWeight: '900',

    },
    chevronIconRight: {
        fontSize: 20,
        color: theme.textMuted,
        paddingRight: 10
    },
    notificationsTabTopBorder: {
        borderTopWidth: 1,
        borderColor: theme.border
    },
    notificationContainer: {
        backgroundColor: theme.backgroundMuted,
        borderWidth: 1,
        borderColor: theme.border,
        flexDirection: 'column',
        borderRadius: 5
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'space-between'
    },
    notification:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    notificationItemWithBorder:{
        borderTopWidth: 1,
        borderTopColor: theme.border,
    },
    remainderTimeBtn:{
        backgroundColor: theme.backgroundMutedExtra,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
    },
    remainderValueStyle:{
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.text
    }
})

export default settingsStyles;