import { View, Text } from 'react-native'
import React from 'react'
import { useResultStyles } from '../../hook/useThemeStyles'

const Results = () => {
  const style = useResultStyles();
  return (
    <View style={style.container}>
      <Text>Results</Text>
    </View>
  )
}

export default Results;