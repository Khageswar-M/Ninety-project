import { Stack } from "expo-router"

const _layout = () => {
  return (
    <Stack
      initialRouteName="LoginPage"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        presentation: 'transparentModal',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="LoginPage" />
      <Stack.Screen name="SignUpPage" />
      <Stack.Screen name="ForgetPassword" />
    </Stack>
  )
}

export default _layout