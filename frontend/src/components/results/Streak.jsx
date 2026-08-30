import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useResultStyles } from '../../hook/useThemeStyles';

const TOTAL_DAYS = 90;
const ANIMATION_DURATION_MS = 1000;

const Streak = ({ refreshKey }) => {
    const style = useResultStyles();

    const rawGrid = useSelector((state) => state.app.dayGrid);
    const rawCurrentDay = useSelector((state) => state.app.currentDay);

    const [counts, setCounts] = useState({ current: 0, best: 0, daysLeft: 0 });
    const rafId = useRef(null);

    // 1. Calculate actual streak metrics
    const { currentStreak, bestStreak, daysLeft } = useMemo(() => {
        const safeGrid = Array.isArray(rawGrid) ? rawGrid.flat() : [];

        // Treat missing/invalid currentDay as "no days elapsed yet" rather than
        // silently coercing it with `|| 0`, which would also mask a real 0.
        const currentDay = Number.isFinite(rawCurrentDay) ? rawCurrentDay : 0;
        const safeCurrentDay = Math.max(0, Math.min(currentDay, safeGrid.length));

        // Only consider days that have already occurred
        const grid = safeGrid.slice(0, safeCurrentDay);

        // Best streak: longest consecutive run of completed days
        let best = 0;
        let running = 0;

        for (const cell of grid) {
            if (Boolean(cell)) {
                running++;
                best = Math.max(best, running);
            } else {
                running = 0;
            }
        }

        // Current streak: consecutive completed days counting back from today
        let current = 0;

        for (let i = grid.length - 1; i >= 0; i--) {
            if (Boolean(grid[i])) {
                current++;
            } else {
                break;
            }
        }

        return {
            currentStreak: current,
            bestStreak: best,
            daysLeft: Math.max(0, TOTAL_DAYS - safeCurrentDay),
        };
    }, [rawGrid, rawCurrentDay]);

    // 2. Debug log — only fires when the underlying data actually changes,
    //    not on every animation tick/render.
    useEffect(() => {
        console.log('Raw Grid in streak: ', rawGrid);
        console.log('Current Day in streak: ', rawCurrentDay);
    }, [rawGrid, rawCurrentDay]);

    // 3. Single rAF loop drives all three counters together — one render
    //    per frame instead of three independent interval-driven render storms.
    useEffect(() => {
        const targets = { current: currentStreak, best: bestStreak, daysLeft };
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