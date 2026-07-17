import { View, Text } from 'react-native'
import { useAuthStyles } from '../../src/hook/useThemeStyles'
import SignUp from '../../src/components/screens/auth/SignUp'

const SignUpPage = () => {
  const style = useAuthStyles();
  return (
    <View style={style.container}>
      <SignUp />
    </View>
  )
}

export default SignUpPage