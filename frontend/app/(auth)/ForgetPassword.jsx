import { View, Text } from 'react-native'
import React from 'react'
import SignUp from '../../src/components/screens/auth/SignUp'
import { useAuthStyles } from '../../src/hook/useThemeStyles'

const ForgetPassword = () => {
    const style = useAuthStyles();
  return (
    <View style={style.container}>
      <SignUp mode="forgotPassword"/>
    </View>
  )
}

export default ForgetPassword