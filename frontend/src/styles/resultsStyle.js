import { StyleSheet } from "react-native";
import { Fonts } from "../constants/Fonts";

const resultStyles = (theme) => StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: theme.background,
    },
    containerContentStyle:{
        flexDirection: 'column',
        gap: 10
    },
    componentContainer:{
        flexDirection: 'column',
        gap: 5
    },
    componentTitle:{
        color: theme.textMuted,
        fontSize: 12
    },
    headerContainer:{
        paddingHorizontal: 10
    },
    header:{
        backgroundColor: theme.backgroundMuted,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTextContainer:{
        flexDirection: 'column',
        gap: 3
    },
    headerTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text
    },
    headerDesc:{
        fontSize: 14,
        color: theme.textMuted
    },
    headerTotalDay:{
        backgroundColor: theme.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
        borderColor: theme.border,
        borderWidth: 1
    },
    totalDayText:{
        color: theme.text,
        fontSize: 12
    },
    performanceContainer: {
        flexDirection: 'row',
        height: 150,
        gap: 10,
    },
    leftContainer:{
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
    progressTitle:{
        fontWeight: 'bold',
        fontSize: 10,
        color: theme.text,
    },
    rightContainer:{
        flex: 1,
        gap: 10
    },
    productivityContainer:{
        flex: 1,
        backgroundColor: theme.backgroundMuted,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 5
    },
    productiveDay:{
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.success
    },
    missedDay:{
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.danger
    },
    productiveTitle:{
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.text
    },
    outOfDays:{
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.textMuted
    },
    missedContainer:{
        flex: 1,
        backgroundColor: theme.backgroundMuted,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.border,
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: 5
    },
    streakContainer:{
        flexDirection: 'row',
        gap: 10,
        marginTop: 5
    },
    streakType:{
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
    streakTitle:{
        fontSize: 12,
        textTransform:"uppercase",
        fontWeight: 'bold',
        color: theme.textMuted
    },
    streakCount:{
        fontSize: 18,
        fontWeight: 'bold',
    },
    currentStreak:{
        color: theme.primary
    },
    bestStreak:{
        color: theme.text
    },
    daysLeft:{
        color: theme.success
    },


})

export default resultStyles;