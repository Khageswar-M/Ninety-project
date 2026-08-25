import { View, Text } from 'react-native';
import { useResultStyles } from '../../hook/useThemeStyles';
import { board } from '../../utils/RawData.js';
import { useSelector } from 'react-redux';

const ResultsMap = () => {
    const style = useResultStyles();
    const challenge = useSelector((state) => state.app.dayGrid);
    const currentDay = useSelector((state) => state.app.currentDay);
    return (
        <View>
            <Text style={style.componentTitle}>ResultsMap</Text>
            <View style={style.mapContainer}>
                {challenge.flat().map((cell, index) => (
                    <View key={index} style={[style.colMap, cell ? 
                        style.completeCell : 
                        (index < currentDay - 1) &&
                               style.notCompleteCell  
                    ]} />
                ))}
            </View>
        </View>
    );
};

export default ResultsMap;