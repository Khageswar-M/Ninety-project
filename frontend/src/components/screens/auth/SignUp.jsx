import { useRef, useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
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
import { sendOtpMail, verifyOtp, signUp } from '../../../API/auth/authApi'
import { validateEmail } from '../../../utils/validateEmail'
import { validatePasswordStrength } from '../../../utils/validatePasswordStrength'
import { isUserExists } from '../../../API/users/usersApi'
import ConfirmationModal from '../../modals/ConfirmationModal'

const TOTAL_STEPS = 4
const OTP_LENGTH = 6
const RESEND_SECONDS = 30

const SignUp = () => {

    const styles = useAuthStyles();
    const inset = useSafeAreaInsets();


    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState('Khageswar Maharana');
    const [fullNameError, setFullNameError] = useState(false);
    const [email, setEmail] = useState('khageswarmaharana462@gmail.com');
    const [emailError, setEmailError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [timer, setTimer] = useState(RESEND_SECONDS);
    const [isInvalidOtp, setIsInvalidOtp] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMsg, setModalMsg] = useState('');
    const otpRefs = useRef([]);



    useEffect(() => {
        if (step !== 2) return
        if (timer <= 0) return
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(interval)
    }, [step, timer])

    const handleOtpChange = (value, index) => {
        setIsInvalidOtp(false);
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

    // HANDLE REGISTER ACCOUNT
    const handleCreateAccount = async () => {
        setLoading(true);
        if (!password || !confirmPassword) {
            setPasswordError('Please fill in both fields')
            return
        }
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters')
            return
        }

        if (!validatePasswordStrength(password)) {
            console.log(validatePasswordStrength(password));
            setPasswordError('Password is too weak — add uppercase, numbers, or symbols')
            return
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }
        setPasswordError('')

        try {
            const response = await signUp(email, fullName, password);
            if (response.data.success) {
                setStep(4)
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    // HANDLE FULL NAME CHANGE -> STEP - 1
    const handleFullNameChange = (text) => {
        setFullName(text);

        if (fullNameError) {
            setFullNameError(false);
        }
    };

    // HANDLE EMAIL CHANGE -> STEP - 1
    const handleEmailChange = (text) => {
        setEmail(text);

        if (emailError) {
            setEmailError(false);
        }
    };

    // HANDLE SEND OTP -> STEP - 1 & 2
    const sendOtp = async () => {



        const response = await sendOtpMail(email, fullName);

        if (!response.success) {
            throw new Error("Failed to send OTP");
        }

        return response;
    };

    // ---------- Step 2 -> submit handlers ----------
    // HANDLE SEND OTP WITH DATA VALIDATION -> STEP - 1
    const handleSendOtp = async () => {
        const isFullNameEmpty = !fullName.trim();
        const isEmailEmpty = !email.trim();

        setFullNameError(isFullNameEmpty);
        setEmailError(isEmailEmpty);

        if (isEmailEmpty || isFullNameEmpty) return;

        if (!validateEmail(email)) {
            setEmailError(true);
            return;
        }



        console.log("Email: ", email, " FullName: ", fullName);

        setLoading(true);

        try {

            const userExists = await isUserExists(email);

            if (userExists) {
                console.log("User already exists");
                setModalTitle("User Exists");
                setModalMsg("User already exists with this email.")
                setIsVisible(true);
                return;
            }

            await sendOtp();

            setTimer(RESEND_SECONDS);
            setStep(2);
        } catch (error) {
            console.error("Error sending OTP:", error);
        } finally {
            setLoading(false);
        }
    };

    // HANDLE RESENT OTP -> STEP - 2
    const handleResendOtp = async () => {
        if (timer > 0 || loading) return;

        setOtp(Array(OTP_LENGTH).fill(''));
        setLoading(true);

        try {
            await sendOtp();

            setTimer(RESEND_SECONDS);
        } catch (error) {
            console.error("Error resending OTP:", error);
        } finally {
            setLoading(false);
        }
    };

    // HANDLE VERIFY OTP -> STEP - 2
    const handleVerifyOtp = async () => {
        const code = otp.join('');

        if (code.length !== OTP_LENGTH) {
            return;
        }

        setLoading(true);

        try {
            const response = await verifyOtp(email, code);

            if (response.data.success) {
                setIsInvalidOtp(false);
                setStep(3);
            }
        } catch (error) {
            setIsInvalidOtp(true);
        } finally {
            setLoading(false);
        }
    };

    // HANDLE CHANGE EMAIL -> STEP - 2
    const handleChangeEmail = () => {
        setOtp(Array(OTP_LENGTH).fill(''))
        setStep(1)
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
            <Text style={styles.appName}>Ninety Productive Day's Tracker</Text>
            {renderProgressBars()}
            <Text style={styles.stepTitle}>{title}</Text>
        </View>
    )


    // ---------- Step 1: Email ----------
    const renderStepEmail = () => (
        <RenderStepEmail
            fullName={fullName}
            setFullName={handleFullNameChange}
            email={email}
            setEmail={handleEmailChange}
            handleSendOtp={handleSendOtp}
            handleGoToLogin={handleGoToLogin}
            loading={loading}
            fullNameError={fullNameError}
            emailError={emailError}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
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
            loading={loading}
            isInvalidOtp={isInvalidOtp}
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
            loading={loading}
        >
            {renderHeader('Password')}
        </RenderStepPassword>
    )

    // ---------- Step 4: Confirmation ----------
    const renderStepConfirmation = () => (
        <RenderStepConfirmation
            handleGoToLogin={handleGoToLogin}
        >
            {renderHeader("")}
        </RenderStepConfirmation>
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
        <>
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

            {
                isVisible && (
                    <ConfirmationModal
                        isVisible={isVisible}
                        onCancel={() => setIsVisible(false)}
                        onAction={() => setIsVisible(false)}
                        title={modalTitle || "Alert"}
                        message={modalMsg}
                        cancelBtnTitle="OK"
                        visible={false}
                    />
                )
            }
        </>

    )
}

export default SignUp;

