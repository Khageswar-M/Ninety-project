import { View, Text, TextInput } from 'react-native'
import { useAuthStyles } from '../../../hook/useThemeStyles'
import { TouchableOpacity } from 'react-native';
const RenderStepEmail = ({
    children,
    email,
    setEmail,
    handleSendOtp,
    handleGoogleSignUp,
    handleGoToLogin
}) => {
    const styles = useAuthStyles();
    return (
        <View style={styles.stepContainer}>
            {children}
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
}

export default RenderStepEmail