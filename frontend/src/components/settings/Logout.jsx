import { View, Text, TouchableOpacity } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { MaterialIcons } from '@expo/vector-icons';

const Logout = () => {
    const style = useSettingStyles();

    const handleLogout = () => {
        console.log("logout btn clicked");
    }

    return (
        <View>
            <Text style={style.componentTitle}>Logout</Text>

            <TouchableOpacity 
                style={style.notificationContainer}
                activeOpacity={0.5}
                onPress={() => handleLogout()}
            >
                <View style={style.logoutBtnContainer}>
                    <View style={style.logoutBtnBox}>
                        <MaterialIcons name='logout' style={style.logoutIcon} />
                        <Text style={style.logoutTitle}>Logout</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default Logout