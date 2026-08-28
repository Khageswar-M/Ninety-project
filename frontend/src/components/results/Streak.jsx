import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useResultStyles } from '../../hook/useThemeStyles';
import { useSelector } from 'react-redux';

const TOTAL_DAYS = 90;
const ANIMATION_DURATION_MS = 1000;

const Streak = ({ refreshKey }) => {
    const style = useResultStyles();
    const rawGrid = useSelector((state) => state.app.dayGrid);
    const currentDay = useSelector((state) => state.app.currentDay) || 0;


    const [counts, setCounts] = useState({ current: 0, best: 0, daysLeft: 0 });
    const rafId = useRef(null);

    // 1. Calculate actual streak metrics
    const { currentStreak, bestStreak, daysLeft } = useMemo(() => {
        const safeGrid = Array.isArray(rawGrid) ? rawGrid.flat() : [];
        const safeCurrentDay = Math.max(0, Math.min(currentDay, safeGrid.length));
        const grid = safeGrid.slice(0, safeCurrentDay);

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

        let trailingStreak = 0;
        
        for (let i = currentDay - 1; i >= 0; i--) {
            if (grid[i]) {
                trailingStreak++;
            } else {
                break;
            }
        }

        return {
            currentStreak: trailingStreak,
            bestStreak: maxStreak,
            daysLeft: Math.max(0, TOTAL_DAYS - safeCurrentDay),
        };
    }, [rawGrid, currentDay]);

    // 2. Debug log — only fires when the underlying data actually changes,
    //    not on every animation tick/render.
    useEffect(() => {
        console.log('Raw Grid in streak: ', rawGrid);
    }, [rawGrid]);

    // 3. Single rAF loop drives all three counters together — one render
    //    per frame instead of three independent interval-driven render storms.
    useEffect(() => {
        const targets = { current: currentStreak, best: bestStreak, daysLeft: daysLeft };
        const startValues = { current: 0, best: 0, daysLeft: 0 };
        const startTime = performance.now();

        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }

        const allZero = Object.values(targets).every((t) => t <= 0);
        if (allZero) {
            setCounts({ current: 0, best: 0, daysLeft: 0 });
            return;
        }

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / ANIMATION_DURATION_MS);

            setCounts({
                current: Math.round(startValues.current + (targets.current - startValues.current) * progress),
                best: Math.round(startValues.best + (targets.best - startValues.best) * progress),
                daysLeft: Math.round(startValues.daysLeft + (targets.daysLeft - startValues.daysLeft) * progress),
            });

            if (progress < 1) {
                rafId.current = requestAnimationFrame(tick);
            } else {
                rafId.current = null;
            }
        };

        rafId.current = requestAnimationFrame(tick);

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
        };
    }, [currentStreak, bestStreak, daysLeft, refreshKey]);

    return (
        <View>
            <Text style={style.componentTitle}>Streak</Text>

            <View style={style.streakContainer}>
                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.currentStreak]}>
                        {counts.current}
                    </Text>
                    <Text style={style.streakTitle}>Current</Text>
                </View>

                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.bestStreak]}>
                        {counts.best}
                    </Text>
                    <Text style={style.streakTitle}>Best</Text>
                </View>

                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.daysLeft]}>
                        {counts.daysLeft}
                    </Text>
                    <Text style={style.streakTitle}>Days Left</Text>
                </View>
            </View>
        </View>
    );
};

export default Streak;