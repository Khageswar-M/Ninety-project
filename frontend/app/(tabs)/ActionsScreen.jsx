import { View } from 'react-native';
import Actions from '../../src/components/screens/Actions';

const ActionsScreen = () => {
  console.log("Actions Screen mounted");
  return (
    <View style={{ flex: 1 }}>
      <Actions />
    </View>
  )
}

export default ActionsScreen