import React, { useMemo, useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useResultStyles } from '../../hook/useThemeStyles';
import { useSelector } from 'react-redux';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CircularProgress({
    value = 0, maxValue = 100, radius = 60, strokeWidth = 8,
    activeStrokeColor = '#3b82f6', inactiveStrokeColor = '#e5e7eb',
    valueColor = '#000', titleColor = '#666', title = '', duration = 1000,
}) {
    const anim = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: value,
            duration,
            useNativeDriver: false, // strokeDashoffset + listener both require JS driver
        }).start();

        // Mirror the animated value into state so the Text re-renders each frame too
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: valueColor }}>
                    {displayValue}%
                </Text>
                {!!title && <Text style={{ fontSize: 10, color: titleColor }}>{title}</Text>}
            </View>
        </View>
    );
}

const Performance = ({ refreshKey }) => {
    const style = useResultStyles();

    const rawGrid = useSelector((state) => state.app.dayGrid);
    const currentDay = useSelector((state) => state.app.currentDay) || 0;
    const TOTAL_DAYS = 90;

    const { completedDays, missedDays, totalProgressRate, adherenceRate } = useMemo(() => {
        const flatBoard = (rawGrid || []).flat();
        const completed = flatBoard.slice(0, currentDay).filter(Boolean).length;
        const missed = Math.max(0, currentDay - completed);
        const totalProgress = Math.round((completed / TOTAL_DAYS) * 100);
        const adherence = currentDay > 0 ? Math.round((completed / currentDay) * 100) : 0;

        return {
            completedDays: completed,
            missedDays: missed,
            totalProgressRate: totalProgress,
            adherenceRate: adherence,
        };
    }, [rawGrid, currentDay]);

    return (
        <View style={style.componentContainer}>
            <Text style={style.componentTitle}>PERFORMANCE</Text>

            <View style={style.performanceContainer}>
                <View style={style.leftContainer}>
                    <CircularProgress
                        key={refreshKey}
                        value={adherenceRate}
                        radius={60}
                        duration={2000}
                        activeStrokeColor={style.progressColor}
                        valueColor={style.progressValueColor}
                        titleColor={style.progressTitle.color}
                        title="Success Rate"
                        maxValue={100}
                    />
                </View>

                <View style={style.rightContainer}>
                    <View style={style.productivityContainer}>
                        <Text style={style.productiveDay}>{completedDays}</Text>
                        <Text style={style.productiveTitle}>PRODUCTIVITY</Text>
                        <Text style={style.outOfDays}>Out of {currentDay} days</Text>
                    </View>

                    <View style={style.missedContainer}>
                        <Text style={style.missedDay}>{missedDays}</Text>
                        <Text style={style.productiveTitle}>MISSED</Text>
                        <Text style={style.outOfDays}>Days slipped</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Performance;