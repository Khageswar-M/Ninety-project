import { StyleSheet } from "react-native";
import { Fonts } from "../constants/Fonts";

const resultStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    containerContentStyle: {
        flexDirection: 'column',
        gap: 10,
        paddingBottom: 100
    },
    componentContainer: {
        flexDirection: 'column',
        gap: 5
    },
    componentTitle: {
        color: theme.textMuted,
        fontSize: 12
    },
    headerContainer: {
        paddingHorizontal: 10
    },
    header: {
        backgroundColor: theme.backgroundMuted,
        // borderColor: theme.border,
        // borderWidth: 1,
        // borderRadius: 5,
        paddingHorizontal: 10,
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
        color: theme.text
    },
    headerDesc: {
        fontSize: 14,
        color: theme.textMuted
    },
    headerTotalDay: {
        backgroundColor: theme.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
        borderColor: theme.border,
        borderWidth: 1
    },
    totalDayText: {
        color: theme.text,
        fontSize: 12
    },
    performanceContainer: {
        flexDirection: 'row',
        height: 150,
        gap: 10,
    },
    leftContainer: {
        flex: 1,
        backgroundColor: theme.backgroundMuted,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
    },
    progressColor: theme.primary,
    progressValueColor: theme.text,
    progressTitle: {
        fontWeight: 'bold',
        fontSize: 10,
        color: theme.text,
    },
    rightContainer: {
        flex: 1,
        gap: 10
    },
    productivityContainer: {
        flex: 1,
        backgroundColor: theme.backgroundMuted,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 5
    },
    productiveDay: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.success
    },
    missedDay: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.danger
    },
    productiveTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.text
    },
    outOfDays: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.textMuted
    },
    missedContainer: {
        flex: 1,
        backgroundColor: theme.backgroundMuted,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: 5
    },
    streakContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5
    },
    streakType: {
        flex: 1,
        backgroundColor: theme.backgroundMuted,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 5,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        gap: 5,
    },
    streakTitle: {
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: 'bold',
        color: theme.textMuted
    },
    streakCount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    currentStreak: {
        color: theme.primary
    },
    bestStreak: {
        color: theme.text
    },
    daysLeft: {
        color: theme.success
    },
    mapContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        marginTop: 5
    },
    colMap: {
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.backgroundMuted,
        borderRadius: 3
    },
    completeCell:{
        backgroundColor: theme.primary
    },
    notCompleteCell:{
        backgroundColor: theme.danger
    },
    aiCoachContainer: {
        marginTop: 5,
        // backgroundColor: theme.backgroundMuted,
        borderRadius: 5,
        // borderWidth: 1, 
        // borderColor: theme.border,
        paddingHorizontal: 5
    },
    titleIcon:{
        fontSize: 20,
        color: theme.primary
    },
    aiCoachHeader:{
        gap: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        // borderBottomColor: theme.border,
        // borderBottomWidth: 1,
        paddingBottom: 5
    },
    aiCoachHeaderTitle:{
        color: theme.text,
        fontSize: 14,
        fontWeight: 'bold'
    },
    refreshContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    refreshTitle:{
        fontSize: 12,
        color: theme.textMuted,
        fontWeight: 'bold'
    },
    refreshBtn:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 5,
        backgroundColor: theme.backgroundMutedExtra,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
    },
    refreshIcon:{
        fontSize: 16,
        color: theme.text,
        borderRadius: 20,
    },
    aiCoachResponseContainer:{
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    aiCoachResponseText:{
        fontSize: 16,
        textAlign: 'justify',
        color: theme.text
    },
    quoteContainer:{
        backgroundColor: theme.backgroundMutedExtra,
        marginTop: 10,
        paddingHorizontal: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderLeftWidth: 5,
        borderLeftColor: theme.primary,
        gap: 5,
        paddingVertical: 5
    },
    quoteText:{
        color: theme.text,
        fontSize: 14
    },
    quoteWriter:{
        color: theme.text,
        fontSize: 14
    },

    // AI COACH SECTION
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.text,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dayBlock: {
        marginBottom: 10,
    }, 
    dayLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.textMuted,
        marginBottom: 4,
    },
    activityChip: {
        backgroundColor: theme.primary,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    activityChipText: {
        fontSize: 12,
        color: theme.light,
        fontWeight: '500',
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    goalChip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    goalChipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
        marginTop: 16,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        color: theme.text,
    },
    quoteBox: {
        marginTop: 12,
        backgroundColor: '#FFF8EF',
        borderLeftWidth: 4,
        borderLeftColor: '#F5A623',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    quoteText: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#5A4632',
        lineHeight: 19,
    },
    quoteAuthor: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B7791F',
        marginTop: 6,
        textAlign: 'right',
    },
    centerBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        gap: 8,
    },
    aiContainer: {
        paddingBottom: 4,
    },
    loadingText: {
        fontSize: 13,
        color: '#888',
    },
    errorText: {
        fontSize: 13,
        color: '#C0392B',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F5A623',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 4,
    },
    retryText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyText:{
        
    }

})

export default resultStyles;