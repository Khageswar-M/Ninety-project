import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import { useResultStyles } from '../../hook/useThemeStyles';
import { useSelector } from 'react-redux';

const TOTAL_DAYS = 90;

const Streak = ({ refreshKey }) => {
    const style = useResultStyles();
    const rawGrid = useSelector((state) => state.app.dayGrid);
    const currentDay = useSelector((state) => state.app.currentDay) || 0;

    const [animatedCurrent, setAnimatedCurrent] = useState(0);
    const [animatedBest, setAnimatedBest] = useState(0);
    const [animatedDaysLeft, setAnimatedDaysLeft] = useState(0);

    const activeTimers = useRef([]);

    // 1. Calculate actual streak metrics
    const { currentStreak, bestStreak, daysLeft } = useMemo(() => {
        const grid = (rawGrid || []).flat().slice(0, currentDay);

        let runningStreak = 0;
        let maxStreak = 0;

        for (const cell of grid) {
            if (cell) {
                runningStreak++;
                if (runningStreak > maxStreak) {
                    maxStreak = runningStreak;
                }
            } else {
                runningStreak = 0;
            }
        }

        // Current streak is the active consecutive run at the end of the slice
        let trailingStreak = 0;
        for (let i = grid.length - 1; i >= 0; i--) {
            if (grid[i]) {
                trailingStreak++;
            } else {
                break;
            }
        }

        return {
            currentStreak: trailingStreak,
            bestStreak: maxStreak,
            daysLeft: Math.max(0, TOTAL_DAYS - currentDay),
        };
    }, [rawGrid, currentDay]);

    // 2. Safe count-up animation helper
    const animateCount = (target, setter) => {
        if (target <= 0) {
            setter(0);
            return;
        }

        let count = 0;
        const duration = 1000;
        const stepTime = Math.max(16, Math.floor(duration / target));
        const increment = Math.ceil(target / (duration / stepTime));

        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                setter(target);
                clearInterval(timer);
            } else {
                setter(count);
            }
        }, stepTime);

        activeTimers.current.push(timer);
    };

    // 3. Trigger animations whenever targets or refreshKey change
    useEffect(() => {
        // Clear any ongoing intervals before starting new ones
        activeTimers.current.forEach(clearInterval);
        activeTimers.current = [];

        animateCount(currentStreak, setAnimatedCurrent);
        animateCount(bestStreak, setAnimatedBest);
        animateCount(daysLeft, setAnimatedDaysLeft);

        return () => {
            activeTimers.current.forEach(clearInterval);
            activeTimers.current = [];
        };
    }, [currentStreak, bestStreak, daysLeft, refreshKey]);

    return (
        <View>
            <Text style={style.componentTitle}>Streak</Text>

            <View style={style.streakContainer}>
                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.currentStreak]}>
                        {animatedCurrent}
                    </Text>
                    <Text style={style.streakTitle}>Current</Text>
                </View>

                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.bestStreak]}>
                        {animatedBest}
                    </Text>
                    <Text style={style.streakTitle}>Best</Text>
                </View>

                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.daysLeft]}>
                        {animatedDaysLeft}
                    </Text>
                    <Text style={style.streakTitle}>Days Left</Text>
                </View>
            </View>
        </View>
    );
};

export default Streak;