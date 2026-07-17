import { View, Text } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { Ionicons, EvilIcons, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Profile = () => {
    const style = useSettingStyles();
    return (
        <View>
            <Text style={style.componentTitle}>Profile</Text>

            <View style={style.profileContainer}>
                <View style={style.profileLeft}>

                    <View style={style.profileDp}>
                        <Text style={style.profileDpLetters}>KM</Text>
                    </View>

                    <View style={style.userContainer}>
                        <Text 
                            style={style.userName}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            Khageswar Maharana
                        </Text>
                        <Text
                            style={style.userEmail}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            khageswarmaharana462@gmail.com
                        </Text>
                        <View style={style.userAchievement}>
                            <EvilIcons name='trophy' style={style.trophy} />
                            <Text style={style.userAchievementTitle}>Day 23 of 90</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={style.editBtn}
                    onPress={() => router.push("/(subScreens)/EditProfilePage")}
                >
                    <Feather name='edit' style={style.editBtnIcon} />
                </TouchableOpacity>
            </View>


        </View>
    )
}

export default Profile