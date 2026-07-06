import { View, Text } from 'react-native'
import React from 'react'
import { useSettingStyles } from '../../hook/useThemeStyles'

const Settings = () => {
  const style = useSettingStyles();
  return (
    <View style = {style.container}>
      <Text>Settings</Text>
    </View>
  )
}

export default Settings