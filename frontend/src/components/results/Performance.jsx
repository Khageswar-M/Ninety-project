import { View, Text } from 'react-native'
import { useResultStyles } from '../../hook/useThemeStyles';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useEffect } from 'react';

const Performance = ({refreshKey}) => {
    const style = useResultStyles();
    const progress = 90;
    return (
        <View style={style.componentContainer}>
            <Text style={style.componentTitle}>PERFORMANCE</Text>

            <View style={style.performanceContainer}>
                <View style={style.leftContainer}>
                    <CircularProgress
                        key={refreshKey}
                        value={progress}
                        radius={60}
                        duration={2000}
                        activeStrokeColor={style.progressColor}
                        progressValueColor={style.progressValueColor}
                        maxValue={100}
                        title={`Success Rate`}
                        titleStyle={style.progressTitle}
                        valueSuffix='%'
                    />
                </View>
                <View style={style.rightContainer}>
                    <View style={style.productivityContainer}>
                        <Text style={style.productiveDay}>90</Text>
                        <Text style={style.productiveTitle}>PRODUCTIVITY</Text>
                        <Text style={style.outOfDays}>Out of 0 days</Text>
                    </View>
                    <View style={style.missedContainer}>
                        <Text style={style.missedDay}>5</Text>
                        <Text style={style.productiveTitle}>MISSED</Text>
                        <Text style={style.outOfDays}>Day slipped</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Performance;