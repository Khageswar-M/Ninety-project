import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function IndexRoute() {
    const isLoggedIn = useSelector((state) => state.app.isLogin);

    return (
        <Redirect
            href={isLoggedIn ? "/(tabs)/ActionsScreen" : "/(auth)/LoginPage"}
        />
    );
}