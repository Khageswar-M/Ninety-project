import { Stack } from "expo-router"

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="EditProfilePage"/>
        <Stack.Screen name="PrivacyPolicyPage"/>
        <Stack.Screen name="RattingPage"/>
    </Stack>
  )
}

export default _layout;