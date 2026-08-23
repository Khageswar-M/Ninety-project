import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useResultStyles } from '../../hook/useThemeStyles';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useSelector } from 'react-redux';

const Performance = ({ refreshKey }) => {
    const style = useResultStyles();
    
    // 1. Keep selector raw so reference remains stable
    const rawGrid = useSelector((state) => state.app.dayGrid);
    const currentDay = useSelector((state) => state.app.currentDay) || 0;
    const TOTAL_DAYS = 90;

    // 2. Compute stats directly inside useMemo
    const { completedDays, missedDays, totalProgressRate, adherenceRate } = useMemo(() => {
        const flatBoard = (rawGrid || []).flat();

        const completed = flatBoard
            .slice(0, currentDay)
            .filter(Boolean).length;

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
                        value={adherenceRate} // Or totalProgressRate depending on your goal
                        radius={60}
                        duration={2000}
                        activeStrokeColor={style.progressColor}
                        progressValueColor={style.progressValueColor}
                        maxValue={100}
                        title={`Success Rate`}
                        titleStyle={style.progressTitle}
                        valueSuffix="%"
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