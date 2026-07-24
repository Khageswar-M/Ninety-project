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
        paddingBottom: 100
    },
    headerParent: {
        padding: 10
    },
    headerContainer: {
        width: "100%",
        backgroundColor: theme.backgroundMuted,
        padding: 5,
        paddingHorizontal: 15,
        // borderRadius: 10,
        // borderColor: theme.border,
        // borderWidth: 1
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text
    },
    headerDesc: {
        fontSize: 12,
        color: theme.textMuted
    },
    headerProgressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    barContainer: {
        width: '85%',
        alignItems: 'center'
    },
    headerProgressBar: {
        height: 7,
        backgroundColor: theme.backgroundMutedExtra,
        borderRadius: 5
    },
    headerProgressBarCounter: {
        fontSize: 14,
        color: theme.text,
        fontWeight: "bold"
    },
    boardTitle: {
        color: theme.textMuted,
        fontSize: 12,
        marginBottom: 5
    },
    boardContainer: {
        backgroundColor: theme.backgroundMuted,
        padding: 10,
        borderRadius: 10,
        borderColor: theme.border,
        borderWidth: 1,
        gap: 6,
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        gap: 6,
        width: '100%'
    },
    coll: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    cellChecked: {
        borderColor: theme.light,
        borderWidth: 0.5,
    },
    cellNotChecked: {
        borderColor: theme.danger,
        borderWidth: 0.2,
    },
    cellWillCheckToday: {
        borderColor: theme.successLight,
        borderWidth: 0.2,
    },
    cellWillCheck: {
        borderColor: theme.backgroundMutedExtra,
        borderWidth: 0.2,
    },
    collIndexText: {
        color: theme.text,
        fontWeight: 'bold',
        fontFamily: Fonts.poppins,
        fontSize: 10
    },
    lastCheckContainer: {
        flexDirection: 'row',
        gap: 5,
        marginTop: 4,
        alignItems: 'center'
    },
    lastCheck: {
        fontSize: 12,
        fontFamily: Fonts.poppins,
        color: theme.successLight,
        fontWeight: 'bold'
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primary,
        padding: 12,
        borderRadius: 50,
        alignSelf: 'flex-start',
        gap: 5,
    },
    addBtnActive: theme.primary,
    addBtnInactive: theme.btnDisable,
    addBtnTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: theme.text
    },
    goalsAddInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        width: '100%',
    },
    goalsLengthCount: {
        position: 'absolute',
        zIndex: 1,
        fontSize: 8,
        color: theme.text,
        right: 5,
        bottom: 2,
    },
    goalsAddInput: {
        borderColor: theme.border,
        borderWidth: 1,
        width: '100%',
        borderRadius: 5,
        backgroundColor: theme.backgroundMuted,
        paddingHorizontal: 5,
        color: theme.text,
        fontSize: 16,
        paddingLeft: 50
    },
    goalsAddInputNotFocus: theme.btnDisable,
    goalsAddInputCursor: theme.primary,
    goalsAddInputFocused: {
        borderColor: theme.primary,
    },
    goalsInputIcon: {
        fontSize: 30,
        color: theme.text,
        position: 'absolute',
        zIndex: 1,
        backgroundColor: theme.backgroundMutedExtra,
        marginLeft: 1,
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3
    },
    goalsInputParent: {
        width: '80%',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'row'
    },
    goalsTagContainer: {
        alignItems: 'flex-start',
        marginTop: 10
    },
    goalsTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: theme.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 10,
        borderRadius: 5,
        position: 'relative'
    },
    goalsTagTitle: {
        color: theme.text
    },
    goalsTagIcon: {
        fontSize: 18,
        transform: 'rotate(45deg)',
        color: theme.text
    },
    card: {
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
        minHeight: 32,
    },
    emptyText: {
        fontSize: 13,
        fontStyle: 'italic',
        opacity: 0.6,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingVertical: 6,
        paddingLeft: 12,
        paddingRight: 6,
        maxWidth: '100%',
    },
    chipEditing: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    chipText: {
        color: '#fff',
        fontSize: 13,
        marginRight: 6,
        maxWidth: 160,
    },
    chipCancelBtn: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 10,
        padding: 2,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: theme.text,
    },
    addBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    saveBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
    },

})

export default actionStyle;