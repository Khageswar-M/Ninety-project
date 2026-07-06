import { View, Text } from 'react-native'
import React from 'react'
import { useDevStyles } from '../../hook/useThemeStyles'

const Dev = () => {
  const style = useDevStyles();
  return (
    <View style={style.container}>
      <Text>Dev</Text>
    </View>
  )
}

export default Dev