import { View, Text } from 'react-native'
import { useAuthStyles } from '../../../hook/useThemeStyles'
import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';

const RenderStepPassword = ({
    children,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    handleCreateAccount,
}) => {
    const styles = useAuthStyles();
    return (
        <View style={styles.stepContainer}>
            {children}

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
}

export default RenderStepPassword