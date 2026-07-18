import { View, Text, TextInput } from 'react-native'
import { useSelector } from 'react-redux';
import { useAuthStyles } from '../../../hook/useThemeStyles'
import { TouchableOpacity } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

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
    handleResendOtp
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
                        style={styles.otpBox}
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
                            initialValue={RESEND_SECONDS}
                            radius={18}
                            duration={0}
                            progressValueColor={theme.text}
                            progressValueFontSize={14}
                            activeStrokeColor={theme.primary}
                            inActiveStrokeColor={theme.border}
                            activeStrokeWidth={2}
                            inActiveStrokeWidth={2}
                        />
                    )
                }

            </View>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleVerifyOtp}
                disabled={otp.join('').length !== OTP_LENGTH}
            >
                <Text style={styles.primaryButtonText}>Verify OTP</Text>
            </TouchableOpacity>


        </View>
    )
}

export default RenderStepOtp