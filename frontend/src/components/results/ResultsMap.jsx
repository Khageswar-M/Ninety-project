import { View, Text } from 'react-native';
import { useResultStyles } from '../../hook/useThemeStyles';
import { board } from '../../utils/RawData.js';

const ResultsMap = () => {
    const style = useResultStyles();
    return (
        <View>
            <Text style={style.componentTitle}>ResultsMap</Text>
            <View style={style.mapContainer}>
                {board.flat().map((cell, index) => (
                    <View key={index} style={[style.colMap, cell && style.completeCell]} />
                ))}
            </View>
        </View>
    );
};

export default ResultsMap;