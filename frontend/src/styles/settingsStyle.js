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
    },
    userAchievementTitle: {
        fontSize: 12,
        fontWeight: '300',
        color: theme.successLight
    },
    trophy: {
        fontSize: 16,
        color: theme.successLight
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
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    notificationItemWithBorder: {
        borderTopWidth: 1,
        borderTopColor: theme.border,
    },
    remainderTimeBtn: {
        backgroundColor: theme.backgroundMutedExtra,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
    },
    remainderValueStyle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.text
    },
    themeButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        gap: 10,
        paddingVertical: 10
    },
    themeButton: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 5,
        paddingVertical: 10,
        gap: 10
    },
    themeColorBtn: {
        height: 20,
        width: '70%',
        borderRadius: 5
    },
    themeButtonTittleText: {
        color: theme.textMuted,
        fontSize: 14,
        fontWeight: 'bold'
    },
    themeAutoPartLeft: {
        flexGrow: 1,
        height: '100%',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    themeAutoPartRight: {
        flexGrow: 1,
        height: '100%',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    themeBtnActive: {
        color: theme.primary,
        fontWeight: 'bold'
    },
    themeBtnInactive: {
        color: theme.textMuted,
        fontWeight: '300'
    },
    versionTitleTab: {
        backgroundColor: theme.background,
        marginRight: 10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20
    },
    versionTitle: {
        fontSize: 13,
        color: theme.textMuted
    },
    logoutBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        justifyContent: 'center'
    },
    logoutBtnBox: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 10
    },
    logoutIcon: {
        fontSize: 25,
        color: theme.danger
    },
    logoutTitle: {
        fontSize: 16,
        color: theme.danger
    },
    editNameHeaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 20,
        position: 'relative',
        justifyContent: 'center',
        paddingVertical: 20,
        alignItems: 'center'
    },
    editNameBackBtn: {
        position: 'absolute',
        left: 20
    },
    editNameBackBtnIcon: {
        fontSize: 20,
        color: '#fff'
    },
    editNamePageTitle: {
        alignSelf: 'center',
        position: 'relative',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    editNameContainer: {
        paddingHorizontal: 10
    },
    editNameBox: {
        backgroundColor: theme.backgroundMuted,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 5,
        padding: 10
    },
    editInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    editNameInputActive: {
        backgroundColor: theme.backgroundMutedExtra,
        width: '100%',
        borderRadius: 5,
        color: theme.text
    },
    editNameInputInactive: {
        color: theme.text
    },
    userEmailContainer: {
        paddingVertical: 5
    },
    userEmailText: {
        color: theme.textMuted,
        fontWeight: '300',
        fontSize: 12
    },
    editNameIconContainer: {
        padding: 10,
        backgroundColor: '#303030',
        borderRadius: 10
    },
    noteContainer: {
        marginTop: 10,
    },
    noteTitle: {
        color: theme.primary,
        fontWeight: 'bold',

    },
    note: {
        color: theme.textMuted,
        fontSize: 12,
        fontWeight: '200',
        textAlign: 'justify'
    },
    cancelUpdateBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
        gap: 10
    },
    cancelUpdateBtnTitle: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
    cancelUpdateBtn: {
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1
    },
    policyContainer: {
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 10
    },
    policyHeaderTitle: {
        color: theme.primary,
        fontWeight: 'bold',
        fontSize: 18
    },
    policyHeaderDesc: {
        fontSize: 12,
        color: theme.textMuted,
        fontWeight: '300'
    },
    policyContent: {
        color: theme.text,
        fontSize: 14,
        textAlign: 'justify'
    },
    likeDislikeBtn: {
        color: theme.textMuted
    },
    likeDislikeContainer: {
        paddingVertical: 10,
        backgroundColor: theme.background
    },
    likeDislikeSubContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        gap: 15,
        paddingRight: 40
    },
    rattingStarsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    feedbackContainer:{
        paddingHorizontal: 10,
        marginTop: 10,
        maxWidth: 500
    },
    feedbackInput:{
        backgroundColor: theme.backgroundMuted,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 5,
        color: theme.text,
        paddingHorizontal: 5,
        fontSize: 18
    },
    submitBtn:{
        backgroundColor: theme.successLight,
        margin: 'auto',
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5
    },
    submitBtnTitle:{
        fontSize: 18,
        color: 'transparent',
        fontWeight: 'bold',
        letterSpacing: 1.5
    }, 
    reviewContainer:{
        // backgroundColor: theme.backgroundMuted,
        // padding: 10,
        // borderRadius: 5,
        // borderWidth: 1,
        // borderColor: theme.border
        flexDirection: 'column',
        gap: 10
    },
    review:{
        flexDirection: 'column',
        gap: 5,
        backgroundColor: theme.backgroundMuted,
        padding: 10,
        borderRadius: 5,
    },
    reviewer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dp:{
        backgroundColor: theme.background,
        padding: 10,
        height: 50,
        width: 50,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.border
    },
    dpTitle:{
        color:theme.text,
        fontSize: 16,
        fontWeight:'bold'
    },
    rattingAndJoinedContainer:{
        flexDirection: 'column',
        gap: 5
    },
    userName:{
        fontSize: 14,
        color: theme.text
    },
    userRatting:{
        letterSpacing: 5
    },
    userRattingIcon:{
        color: theme.primary,
        fontSize: 14
    },
    userFeedback:{
        fontSize: 14,
        color: theme.text
    }

})

export default settingsStyles;