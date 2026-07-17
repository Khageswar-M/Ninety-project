import { useRef, useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    //   StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CircularProgress from 'react-native-circular-progress-indicator'
import { useAuthStyles } from '../../../hook/useThemeStyles'

const TOTAL_STEPS = 4
const OTP_LENGTH = 6
const RESEND_SECONDS = 30

const SignUp = () => {
    const styles = useAuthStyles()
    const inset = useSafeAreaInsets()

    // ---------- Global step state ----------
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Password, 4: Confirmation

    // ---------- Step 1: Email ----------
    const [email, setEmail] = useState('')

    // ---------- Step 2: OTP ----------
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
    const otpRefs = useRef([])
    const [timer, setTimer] = useState(RESEND_SECONDS)

    useEffect(() => {
        if (step !== 2) return
        if (timer <= 0) return
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(interval)
    }, [step, timer])

    const handleOtpChange = (value, index) => {
        const updated = [...otp]
        updated[index] = value
        setOtp(updated)
        if (value && index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleResendOtp = () => {
        if (timer > 0) return
        setOtp(Array(OTP_LENGTH).fill(''))
        setTimer(RESEND_SECONDS)
        // TODO: trigger resend OTP API call
    }

    // ---------- Step 3: Password ----------
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const handleCreateAccount = () => {
        if (!password || !confirmPassword) {
            setPasswordError('Please fill in both fields')
            return
        }
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }
        setPasswordError('')
        // TODO: submit new password to backend
        setStep(4)
    }

    // ---------- Step 2 -> submit handlers ----------
    const handleSendOtp = () => {
        if (!email) return
        // TODO: trigger send OTP API call
        setTimer(RESEND_SECONDS)
        setStep(2)
    }

    const handleVerifyOtp = () => {
        const code = otp.join('')
        if (code.length !== OTP_LENGTH) return
        // TODO: verify OTP with backend
        setStep(3)
    }

    const handleChangeEmail = () => {
        setOtp(Array(OTP_LENGTH).fill(''))
        setStep(1)
    }

    const handleGoogleSignUp = () => {
        // TODO: trigger Google OAuth signup
    }

    const handleGoToLogin = () => {
        // TODO: navigate to login screen, e.g. router.replace('/login')
    }

    // ---------- Progress bar header ----------
    const renderProgressBars = () => (
        <View style={styles.progressRow}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const barIndex = i + 1
                const isCompleted = barIndex < step
                const isActive = barIndex === step
                return (
                    <View
                        key={barIndex}
                        style={[
                            styles.progressBar,
                            isCompleted && styles.progressBarCompleted,
                            isActive && styles.progressBarActive,
                        ]}
                    />
                )
            })}
        </View>
    )

    const renderHeader = (title) => (
        <View style={styles.headerWrap}>
            <Text style={styles.appName}>Ninety</Text>
            {renderProgressBars()}
            <Text style={styles.stepTitle}>{title}</Text>
        </View>
    )

    // ---------- Step 1: Email ----------
    const renderStepEmail = () => (
        <View style={styles.stepContainer}>
            {renderHeader('Create your account')}

            <Text style={styles.label}>Email address</Text>
            <TextInput
                style={styles.signUpInput}
                placeholder="you@example.com"
                placeholderTextColor="#9a9a9a"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSendOtp}
                disabled={!email}
            >
                <Text style={styles.primaryButtonText}>Send OTP</Text>
            </TouchableOpacity>

            <View style={styles.signUpDividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
                style={styles.signupGoogleButton}
                onPress={handleGoogleSignUp}
            >
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoToLogin}>
                <Text style={styles.footerLink}>
                    Already have an account? <Text style={styles.footerLinkBold}>Log in</Text>
                </Text>
            </TouchableOpacity>
        </View>
    )

    // ---------- Step 2: Verify OTP ----------
    const renderStepOtp = () => (
        <View style={styles.stepContainer}>
            {renderHeader('Verify OTP')}

            <TouchableOpacity onPress={handleChangeEmail}>
                <Text style={styles.changeEmailText}>
                    Code sent to {email || 'your email'} · <Text style={styles.footerLinkBold}>Change email</Text>
                </Text>
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
                    />
                ))}
            </View>

            <View style={styles.timerWrap}>
                <CircularProgress
                    value={timer}
                    maxValue={RESEND_SECONDS}
                    initialValue={RESEND_SECONDS}
                    radius={40}
                    duration={0}
                    progressValueColor="#333"
                    activeStrokeColor="#6C5CE7"
                    inActiveStrokeColor="#E0E0E0"
                    activeStrokeWidth={6}
                    inActiveStrokeWidth={6}
                    title="sec"
                    titleColor="#999"
                    titleStyle={{ fontSize: 10 }}
                />
            </View>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleVerifyOtp}
                disabled={otp.join('').length !== OTP_LENGTH}
            >
                <Text style={styles.primaryButtonText}>Verify OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
                <Text
                    style={[
                        styles.footerLink,
                        timer > 0 && styles.footerLinkDisabled,
                    ]}
                >
                    {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </Text>
            </TouchableOpacity>
        </View>
    )

    // ---------- Step 3: Password ----------
    const renderStepPassword = () => (
        <View style={styles.stepContainer}>
            {renderHeader('Password')}

            <Text style={styles.label}>New password</Text>
            <TextInput
                style={styles.signUpInput}
                placeholder="Enter password"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
                style={styles.signUpInput}
                placeholder="Re-enter password"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {!!passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
            )}

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCreateAccount}
            >
                <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    )

    // ---------- Step 4: Confirmation ----------
    const renderStepConfirmation = () => (
        <View style={styles.stepContainer}>
            <View style={styles.headerWrap}>
                <Text style={styles.appName}>Ninety</Text>
            </View>

            <View style={styles.confirmationWrap}>
                <Text style={styles.confirmationEmoji}>✅</Text>
                <Text style={styles.confirmationTitle}>Account created!</Text>
                <Text style={styles.confirmationSubtitle}>
                    Your account has been set up successfully. You can now log in and
                    start your 90-day challenge.
                </Text>
            </View>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGoToLogin}
            >
                <Text style={styles.primaryButtonText}>Go to Login</Text>
            </TouchableOpacity>
        </View>
    )

    const renderStep = () => {
        switch (step) {
            case 1:
                return renderStepEmail()
            case 2:
                return renderStepOtp()
            case 3:
                return renderStepPassword()
            case 4:
                return renderStepConfirmation()
            default:
                return renderStepEmail()
        }
    }

    return (
        <View
            style={[styles.signupContainer, { paddingTop: inset.top }]}
        >
            {renderStep()}
        </View>
    )
}

export default SignUp;

