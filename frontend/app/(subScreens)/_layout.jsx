import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="EditProfilePage" />

      <Stack.Screen name="PrivacyPolicyPage" />

      <Stack.Screen name="RattingPage" />
    </Stack>
  );
}