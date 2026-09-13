import { View } from 'react-native';

import Settings from '../../src/components/screens/Settings';

const SettingsScreen = () => {
  console.log("Settings Screen mounted");
  return (
    <View style={{ flex: 1 }}>
      <Settings />
    </View>
  )
}

export default SettingsScreen