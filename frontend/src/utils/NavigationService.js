import { router } from "expo-router";

export function goToLogin(){
    router.replace("/(auth)/LoginPage");
}