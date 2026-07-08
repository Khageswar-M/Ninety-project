import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useResultStyles } from '../../hook/useThemeStyles';

const Streak = ({ refreshKey }) => {
    const style = useResultStyles();

    const [current, setCurrent] = useState(0);
    const [best, setBest] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);

    const handleCount = (target, setter) => {
        if (target <= 0) {
            setter(0);
            return;
        }

        let count = 0;
        const duration = 1000;
        const interval = duration / target;

        const timer = setInterval(() => {
            count++;
            setter(count);

            if (count >= target) {
                clearInterval(timer);
            }
        }, interval);
    };

    useEffect(() => {
        handleCount(2, setCurrent);
        handleCount(4, setBest);
        handleCount(60, setDaysLeft);
    }, [refreshKey]);

    return (
        <View>
            <Text style={style.componentTitle}>Streak</Text>

            <View style={style.streakContainer}>
                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.currentStreak]}>
                        {current}
                    </Text>
                    <Text style={style.streakTitle}>Current</Text>
                </View>

                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.bestStreak]}>
                        {best}
                    </Text>
                    <Text style={style.streakTitle}>Best</Text>
                </View>

                <View style={style.streakType}>
                    <Text style={[style.streakCount, style.daysLeft]}>
                        {daysLeft}
                    </Text>
                    <Text style={style.streakTitle}>Days Left</Text>
                </View>
            </View>
        </View>
    );
};

export default Streak;