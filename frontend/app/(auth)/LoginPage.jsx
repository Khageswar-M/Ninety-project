import { View, Text } from 'react-native'
import { useAuthStyles } from '../../src/hook/useThemeStyles'
import Login from '../../src/components/screens/auth/Login'
const LoginPage = () => {
  const style = useAuthStyles();
  return (
    <View style={style.container}>
      <Login/>
    </View>
  )
}

export default LoginPage