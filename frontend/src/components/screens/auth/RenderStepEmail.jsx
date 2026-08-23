import { View, Text, TextInput } from 'react-native'
import { useAuthStyles } from '../../../hook/useThemeStyles'
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';
import ConfirmationModal from '../../modals/ConfirmationModal';

const RenderStepEmail = ({
    children,
    fullName,
    setFullName,
    email,
    setEmail,
    handleSendOtp,
    handleGoToLogin,
    loading,
    fullNameError,
    emailError,
}) => {
    const styles = useAuthStyles();
    return (
        <View style={styles.stepContainer}>
            {children}

            <Text style={styles.label}>Full name</Text>
            <TextInput
                style={[styles.signUpInput, fullNameError && {
                    borderColor: '#ff0e0e'
                }]}
                placeholder="John Doe"
                placeholderTextColor="#9a9a9a"
                autoCapitalize="none"
                keyboardType="default"
                value={fullName}
                onChangeText={setFullName}

            />

            <Text style={styles.label}>Email address</Text>
            <TextInput
                style={[styles.signUpInput, emailError && {
                    borderColor: '#ff0e0e'
                }]}
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
                disabled={!email || loading}
            >
                {
                    loading ? (
                        <ActivityIndicator size='small' color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Send OTP</Text>
                    )
                }


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