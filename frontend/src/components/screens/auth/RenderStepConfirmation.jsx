import { View, Text } from 'react-native'
import { useAuthStyles } from '../../../hook/useThemeStyles'
import { TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import Verified from '../../../../assets/icons/Verified.json'
import { useEffect, useRef } from 'react';

const RenderStepConfirmation = ({
    handleGoToLogin
}) => {
    const styles = useAuthStyles();

    return (
        <View style={styles.stepContainer}>
            <View style={styles.headerWrap}>
                <Text style={styles.appName}>Ninety</Text>
            </View>

            <View style={styles.accountCreatedSuccessContainer}>
                <View style={styles.confirmationWrap}>
                    <LottieView
                        source={Verified}
                        autoPlay
                        loop={true}
                        style={{ width: 150, height: 150 }}
                    />

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