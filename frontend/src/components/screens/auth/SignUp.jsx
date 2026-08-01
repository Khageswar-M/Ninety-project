import { useRef, useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    //   StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CircularProgress from 'react-native-circular-progress-indicator'
import { useAuthStyles } from '../../../hook/useThemeStyles'
import RenderStepEmail from './RenderStepEmail';
import RenderStepOtp from './RenderStepOtp';
import RenderStepPassword from './RenderStepPassword'
import RenderStepConfirmation from './RenderStepConfirmation'
import RenderProgressBars from './RenderProgressBars'
import { router } from 'expo-router'

const TOTAL_STEPS = 4
const OTP_LENGTH = 6
const RESEND_SECONDS = 30

const SignUp = () => {
    const styles = useAuthStyles()
    const inset = useSafeAreaInsets()

    // ---------- Global step state ----------
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Password, 4: Confirmation

    // ---------- Step 1: Email ----------
    const [email, setEmail] = useState('khageswarmaharana462@gmail.com')

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
        router.replace("(auth)/LoginPage");
    }

    // ---------- Progress bar header ----------
    const renderProgressBars = () => (
        <RenderProgressBars
            TOTAL_STEPS={TOTAL_STEPS}
            step={step}
        />
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
        <RenderStepEmail
            email={email}
            setEmail={setEmail}
            handleSendOtp={handleSendOtp}
            handleGoogleSignUp={handleGoogleSignUp}
            handleGoToLogin={handleGoToLogin}
        >
            {renderHeader('Create your account')}
        </RenderStepEmail>
    )

    // ---------- Step 2: Verify OTP ----------
    const renderStepOtp = () => (
        <RenderStepOtp
            email={email}
            handleChangeEmail={handleChangeEmail}
            otp={otp}
            OTP_LENGTH={OTP_LENGTH}
            otpRefs={otpRefs}
            handleOtpChange={handleOtpChange}
            handleOtpKeyPress={handleOtpKeyPress}
            timer={timer}
            RESEND_SECONDS={RESEND_SECONDS}
            handleVerifyOtp={handleVerifyOtp}
            handleResendOtp={handleResendOtp}
        >
            {renderHeader('Verify OTP')}
        </RenderStepOtp>
    )

    // ---------- Step 3: Password ----------
    const renderStepPassword = () => (
        <RenderStepPassword
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordError={passwordError}
            handleCreateAccount={handleCreateAccount}
        >
            {renderHeader('Password')}
        </RenderStepPassword>
    )

    // ---------- Step 4: Confirmation ----------
    const renderStepConfirmation = () => (
        <RenderStepConfirmation
            handleGoToLogin={handleGoToLogin}
        />
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
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={true}
            enableResetScrollToCoords={true}
            enableOnAndroid={true}
            keyboardOpeningTime={20}
            style={[styles.signupContainer, { paddingTop: inset.top }]}
        >
            {renderStep()}
        </KeyboardAwareScrollView>
    )
}

export default SignUp;

