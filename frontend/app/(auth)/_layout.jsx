import { Stack } from "expo-router"

const _layout = () => {
  return (
    <Stack
      initialRouteName="LoginPage"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LoginPage" />
      <Stack.Screen name="SignUpPage" />
    </Stack>
  )
}

export default _layout