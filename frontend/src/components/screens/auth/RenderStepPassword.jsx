import { View, Text, ActivityIndicator } from 'react-native'
import { useAuthStyles } from '../../../hook/useThemeStyles'
import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';

const getPasswordStrength = (password) => {
    if (!password) return { label: '', score: 0, color: 'transparent' };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', score: 1, color: '#e74c3c' };
    if (score <= 4) return { label: 'Medium', score: 2, color: '#f39c12' };
    return { label: 'Strong', score: 3, color: '#27ae60' };
};

const RenderStepPassword = ({
    children,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    handleCreateAccount,
    loading
}) => {
    const styles = useAuthStyles();
    const strength = getPasswordStrength(password);

    return (
        <View style={styles.stepContainer}>
            {children}

            <Text style={styles.label}>New password</Text>
            <TextInput
                style={styles.signUpInput}
                placeholder="eg.John@123"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                maxLength={20}
            />

            {!!password && (
                <View style={{ marginTop: 6, marginBottom: 4 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 4,
                            height: 4,
                            marginBottom: 4,
                        }}
                    >
                        {[1, 2, 3].map((bar) => (
                            <View
                                key={bar}
                                style={{
                                    flex: 1,
                                    borderRadius: 2,
                                    backgroundColor:
                                        bar <= strength.score
                                            ? strength.color
                                            : '#e0e0e0',
                                }}
                            />
                        ))}
                    </View>
                    <Text style={{ fontSize: 12, color: strength.color, fontWeight: '600' }}>
                        {strength.label}
                    </Text>
                </View>
            )}

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
                style={styles.signUpInput}
                placeholder="Re-enter password"
                placeholderTextColor="#9a9a9a"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                maxLength={20}
            />

            {!!passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
            )}

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCreateAccount}
                disabled={loading}
            >
                {
                    loading ? (
                        <ActivityIndicator size="small" color="#fff"/>
                    ) : (
                        <Text style={styles.primaryButtonText}>Create Account</Text>
                    )
                }
                
            </TouchableOpacity>
        </View>
    )
}

export default RenderStepPassword;
