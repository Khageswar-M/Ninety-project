import { View, Text } from 'react-native'
import { useResultStyles } from '../../hook/useThemeStyles'

const ResultsMap = () => {
    const style = useResultStyles();
    return (
        <View>
            <Text style={style.componentTitle}>ResultsMap</Text>
        </View>
    );
};

export default ResultsMap