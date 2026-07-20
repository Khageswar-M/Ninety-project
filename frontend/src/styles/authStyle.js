import { StyleSheet } from "react-native";
import { Fonts } from "../constants/Fonts";

const authStyle = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    loginContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 35,
    },

    header: {
        marginTop: 50,
    },

    logo: {
        fontSize: 42,
        fontWeight: "700",
        color: theme.primary,
        marginBottom: 16,
        letterSpacing: 1,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: theme.text,
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 15,
        color: theme.textMuted,
        lineHeight: 22,
    },

    form: {
        marginTop: 40,
        gap: 18,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.backgroundMuted,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 58,
    },

    loginInput: {
        flex: 1,
        fontSize: 16,
        color: theme.text,
        marginLeft: 12,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: -4,
    },

    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    remember: {
        marginLeft: 8,
        fontSize: 14,
        color: theme.border,
        fontWeight: "500",
    },

    forgot: {
        fontSize: 14,
        color: theme.primary,
        fontWeight: "600",
    },

    loginButton: {
        backgroundColor: theme.primary,
        height: 56,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        elevation: 4,
        shadowColor: theme.primary,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    loginText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

    loginDividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 12,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: theme.text,
    },

    or: {
        marginHorizontal: 14,
        color: theme.text,
        fontSize: 14,
        fontWeight: "500",
    },

    loginGoogleButton: {
        height: 56,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },

    googleText: {
        fontSize: 16,
        color: "#222",
        fontWeight: "600",
    },

    bottom: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 20
    },

    bottomText: {
        fontSize: 15,
        color: theme.border,
    },

    signup: {
        marginLeft: 6,
        color: theme.primary,
        fontSize: 15,
        fontWeight: "700",
    },


    signupContainer: {
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'space-between'
    },

    stepContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },

    headerWrap: {
        marginTop: 15,
        marginBottom: 30,
    },

    appName: {
        fontSize: 38,
        fontWeight: "700",
        color: theme.primary,
        marginBottom: 20,
        letterSpacing: 1,
    },

    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },

    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: theme.border,
        borderRadius: 50,
        marginHorizontal: 3,
    },

    progressBarCompleted: {
        backgroundColor: theme.primary,
    },

    progressBarActive: {
        backgroundColor: theme.primary,
    },

    stepTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: theme.text,
    },

    label: {
        fontSize: 14,
        color: theme.text,
        fontWeight: "500",
        marginBottom: 8,
        marginTop: 18,
    },

    signUpInput: {
        height: 58,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.backgroundMuted,
        paddingHorizontal: 18,
        fontSize: 16,
        color: theme.text,
    },

    primaryButton: {
        borderRadius: 14,
        backgroundColor: theme.primary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: theme.primary,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        paddingHorizontal: 30,
        paddingVertical: 15,
        marginTop: 20
    },

    primaryButtonText: {
        color: theme.text,
        fontSize: 17,
        fontWeight: "700",
    },

    signUpDividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 22,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.text,
    },

    dividerText: {
        marginHorizontal: 12,
        color: theme.text,
        fontWeight: "600",
    },

    signupGoogleButton: {
        height: 56,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.border,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: '#fff',
    },

    googleButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: '#000',
    },

    footerLink: {
        marginTop: 22,
        textAlign: "center",
        color: theme.text,
        fontSize: 15,
    },

    changeEmailBtn: {
        alignSelf: 'flex-end',
    },

    footerLinkBold: {
        color: theme.primary,
        fontWeight: "700",
        textAlign: 'center',
    },

    footerLinkDisabled: {
        color: theme.border,
    },

    changeEmailText: {
        textAlign: "left",
        color: theme.text,
        fontSize: 12,
        marginBottom: 25,
    },

    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 28,
    },

    otpBox: {
        width: 50,
        height: 50,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "700",
        color: theme.text,
    },

    timerWrap: {
        alignItems: "flex-end",
        marginBottom: 15,
    },

    errorText: {
        color: theme.danger,
        marginTop: 10,
        fontSize: 14,
    },

    confirmationWrap: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
    },

    confirmationEmoji: {
        fontSize: 70,
        marginBottom: 25,
    },

    confirmationTitle: {
        fontSize: 30,
        fontWeight: "700",
        color: theme.text,
        textAlign: 'center'
    },

    confirmationSubtitle: {
        fontSize: 16,
        color: theme.text,
        textAlign: "center",
        lineHeight: 24,
    },

    accountCreatedSuccessContainer: {
        flex: 1,
        paddingVertical: 20,
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
});

export default authStyle;