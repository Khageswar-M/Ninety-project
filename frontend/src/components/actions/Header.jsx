// TAGS
import { View, Text, Animated } from 'react-native'

// STATES
import { useEffect, useRef, useState } from 'react';

// HOOKS
import { useActionStyles } from '../../hook/useThemeStyles'

const Header = () => {
    const style = useActionStyles();

    const [dayCount, setDayCount] = useState(0);

    const widthAnim = useRef(new Animated.Value(0)).current;
    const countAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // PROGRESS BAR ANIMATION
        Animated.timing(widthAnim, {
            toValue: 100,
            duration: 1000,
            useNativeDriver: false
        }).start();

        // COUNTER ANIMATION
        const listenerId = countAnim.addListener((animationState) => {
            setDayCount(Math.round(animationState.value));
        })

        // START COUNTER ANIMATION
        Animated.timing(countAnim, {
            toValue: 90,
            duration: 1000,
            useNativeDriver: true
        }).start();

        // CLEANUP THE LISTENER WHEN THE COMPONENT UNMOUNTS
        return () => {
            countAnim.removeListener(listenerId);
        }
    }, [widthAnim, countAnim]);

    const animatedWidth = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    });

    return (
        // HEADER
        <View style={[style.headerContainer]}>

            {/* HEADER TITLE */}
            <Text style={[style.headerTitle]}>
                90 Days Challenge
            </Text>

            {/* HEADER DESCRIPTION */}
            <Text style={[style.headerDesc]}>
                Tap the box to make the day as productive.
            </Text>

            {/* HEADER PROGRESS BAR */}
            <View style={[style.headerProgressBarContainer]}>
                <View style={{width: '84%'}}>
                    <Animated.View style={[style.headerProgressBar, { width: animatedWidth }]} />
                </View>
                <View>
                    <Text style={[style.headerProgressBarCounter]}>
                        90/{dayCount}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default Header