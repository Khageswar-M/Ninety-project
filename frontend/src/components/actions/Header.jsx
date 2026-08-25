import { View, Text, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// HOOKS
import { useActionStyles } from '../../hook/useThemeStyles';

const Header = () => {

    const style = useActionStyles();

    const completedCount = useSelector((state) => state.app.completedCount);
    const challengeBoard = useSelector((state) => state.app.dayGrid);
    const currentDay = useSelector((state) => state.app.currentDay);
    const TOTAL_DAY = 90;

    // Flatten the 2D matrix into a 1D array of 90 booleans
    const checkedCount = (challengeBoard || [])
        .flat()
        .slice(0, currentDay)
        .filter(Boolean).length;

    const completedPercentage = Math.round((checkedCount / TOTAL_DAY) * 100);

    // Displayed percentage
    const [dayCount, setDayCount] = useState(0);

    // One animation controls everything
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {

        // Start animation
        Animated.timing(progressAnim, {
            toValue: 100,
            duration: 1000,
            useNativeDriver: false,
        }).start();

    }, [completedPercentage]);

    // Progress bar width
    const animatedWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp'
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
                                width: `${completedPercentage}%`,
                            },
                        ]}
                    />
                </View>

                <Text style={style.headerProgressBarCounter}>
                    {completedPercentage}%
                </Text>

            </View>

        </View>
    );
};

export default Header;