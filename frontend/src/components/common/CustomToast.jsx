import { Text, View } from "react-native";
import { useThemeStyles } from "../../hook/useThemeStyles";

export const CustomToast = ({ text1, text2 }) => {
    const styles = useThemeStyles();
    return (
        <View style={styles.toastContainer}>

            <View style={styles.iconContainer}>
                <Text style={styles.icon}>!</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>
                    {text1}
                </Text>

                <Text style={styles.message}>
                    {text2}
                </Text>
            </View>

        </View>
    );
};

