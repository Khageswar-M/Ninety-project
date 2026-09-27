import { View } from 'react-native';

import Results from '../../src/components/screens/Results';

const ResultsScreen = () => {
  console.log("Results Screen Mounted");
  return (
    <View style={{ flex: 1 }}>
      <Results />
    </View>
  )
}

export default ResultsScreen