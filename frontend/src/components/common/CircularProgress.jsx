import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({
    value = 0,
    maxValue = 100,
    radius = 60,
    strokeWidth = 8,
    activeStrokeColor = '#3b82f6',
    inactiveStrokeColor = '#e5e7eb',
    valueColor = '#000',
    valueFontSize = 20,
    valueSuffix = '%',
    title = '',
    titleColor = '#666',
    titleFontSize = 10,
    duration = 1000,
}) {
    // Seed with the starting value so there's no 0-flash on first mount
    const anim = useRef(new Animated.Value(value)).current;
    const [displayValue, setDisplayValue] = useState(Math.round(value));
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: value,
            duration,
            useNativeDriver: false, // strokeDashoffset + listener both need the JS driver
        }).start();

        const listenerId = anim.addListener(({ value: v }) => {
            setDisplayValue(Math.round(v));
        });

        return () => anim.removeListener(listenerId);
    }, [value]);

    const strokeDashoffset = anim.interpolate({
        inputRange: [0, maxValue],
        outputRange: [circumference, 0],
    });

    const size = (radius + strokeWidth) * 2;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={inactiveStrokeColor} strokeWidth={strokeWidth} fill="none"
                />
                <AnimatedCircle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={activeStrokeColor} strokeWidth={strokeWidth} fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center' }}>
                <Text style={{ fontSize: valueFontSize, fontWeight: 'bold', color: valueColor }}>
                    {displayValue}{valueSuffix}
                </Text>
                {!!title && (
                    <Text style={{ fontSize: titleFontSize, color: titleColor }}>{title}</Text>
                )}
            </View>
        </View>
    );
}