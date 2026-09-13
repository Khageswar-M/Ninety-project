import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Page Not Found</Text>

            <Text style={styles.message}>
                Sorry, the page you're looking for doesn't exist.
            </Text>

            <Link href="/" style={styles.link}>
                Go back to Home
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 10,
    },

    message: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },

    link: {
        fontSize: 16,
        textDecorationLine: "underline",
    },
});