import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux';
import { useAuthStyles } from '../../../hook/useThemeStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CircularProgress from '../../common/CircularProgress'; // ← adjust path to wherever you place the shared file

const RenderStepOtp = ({
    children,
    email,
    handleChangeEmail,
    otp,
    OTP_LENGTH,
    otpRefs,
    handleOtpChange,
    handleOtpKeyPress,
    timer,
    RESEND_SECONDS,
    handleVerifyOtp,
    handleResendOtp,
    loading,
    isInvalidOtp
}) => {
    const styles = useAuthStyles();
    const theme = useSelector((state) => state.theme.theme);
    return (
        <View style={styles.stepContainer}>
            {children}

            <Text style={styles.changeEmailText}>
                OTP sent to {email}
            </Text>
            <TouchableOpacity onPress={handleChangeEmail} style={styles.changeEmailBtn}>
                <Text style={styles.footerLinkBold}>Change email</Text>
            </TouchableOpacity>

            <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (otpRefs.current[index] = ref)}
                        style={[styles.otpBox, isInvalidOtp && { borderBottomColor: '#ff0a0a' }]}
                        maxLength={1}
                        keyboardType="number-pad"
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        selectionColor={theme.primary}
                    />
                ))}
            </View>

            <View style={styles.timerWrap}>
                {
                    timer <= 0 ? (
                        <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
                            <Text style={styles.footerLink}>
                                Resend OTP
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <CircularProgress
                            value={timer}
                            maxValue={RESEND_SECONDS}
                            radius={18}
                            strokeWidth={2}
                            duration={0}
                            activeStrokeColor={theme.primary}
                            inactiveStrokeColor={theme.border}
                            valueColor={theme.text}
                            valueFontSize={14}
                            valueSuffix=""
                        />
                    )
                }
            </View>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleVerifyOtp}
                disabled={otp.join('').length !== OTP_LENGTH}
            >
                {
                    loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Verify OTP</Text>
                    )
                }
            </TouchableOpacity>
        </View>
    )
}

export default RenderStepOtp