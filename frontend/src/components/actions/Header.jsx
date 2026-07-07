import { View, Text, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';

// HOOKS
import { useActionStyles } from '../../hook/useThemeStyles';

const Header = () => {
    const style = useActionStyles();

    // Displayed percentage
    const [dayCount, setDayCount] = useState(0);

    // One animation controls everything
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Listen to animation value and update text
        const listenerId = progressAnim.addListener(({ value }) => {
            setDayCount(Math.round(value));
        });

        // Start animation
        Animated.timing(progressAnim, {
            toValue: 100,
            duration: 1000,
            useNativeDriver: false, // Required because width is not supported by native driver
        }).start();

        // Cleanup
        return () => {
            progressAnim.removeListener(listenerId);
        };
    }, []);

    // Progress bar width
    const animatedWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={style.headerContainer}>

            {/* Header Title */}
            <Text style={style.headerTitle}>
                90 Days Challenge
            </Text>

            {/* Header Description */}
            <Text style={style.headerDesc}>
                Tap the box to make the day productive.
            </Text>

            {/* Progress Bar */}
            <View style={style.headerProgressBarContainer}>

                <View style={style.barContainer}>
                    <Animated.View
                        style={[
                            style.headerProgressBar,
                            {
                                width: animatedWidth,
                            },
                        ]}
                    />
                </View>

                <Text style={style.headerProgressBarCounter}>
                    {dayCount}%
                </Text>

            </View>

        </View>
    );
};

export default Header;