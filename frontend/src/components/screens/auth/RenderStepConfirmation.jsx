import { View, Text } from 'react-native'
import { useAuthStyles } from '../../../hook/useThemeStyles'
import { TouchableOpacity } from 'react-native';
const RenderStepConfirmation = ({
    handleGoToLogin
}) => {
    const styles = useAuthStyles();
    return (
        <View style={styles.stepContainer}>
            <View style={styles.headerWrap}>
                <Text style={styles.appName}>Ninety</Text>
            </View>

            <View style={{
                flex: 1,
                paddingVertical: 20,
                flexDirection: 'column',
                gap: 20
            }}>
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
        </View>
    )
}

export default RenderStepConfirmation