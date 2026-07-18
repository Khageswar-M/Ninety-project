import { View, Text } from 'react-native'
import { useAuthStyles } from '../../../hook/useThemeStyles'

const RenderProgressBars = ({
    TOTAL_STEPS,
    step,

}) => {
    const styles = useAuthStyles();
    return (
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
}

export default RenderProgressBars