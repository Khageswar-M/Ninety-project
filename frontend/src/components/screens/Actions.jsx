import { View, Text } from 'react-native'
import React from 'react'
import {useActionStyles} from '../../hook/useThemeStyles.js';

const Actions = () => {
  const style = useActionStyles();
  return (
    <View style={[style.container]}>
      <Text>Actions</Text>
    </View>
  )
}

export default Actions;