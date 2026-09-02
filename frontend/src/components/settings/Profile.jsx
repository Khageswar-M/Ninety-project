import { View, Text } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { Ionicons, EvilIcons, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';

const Profile = () => {
    const style = useSettingStyles();
    const currentDay = useSelector((state) => state.app.currentDay);
    const userFullName = useSelector((state) => state.app.userName);
    const userEmail = useSelector((state) => state.app.userEmail)

    console.log(userFullName); 
    console.log(userEmail);

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
                            {userFullName}
                        </Text>
                        <Text
                            style={style.userEmail}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {userEmail}
                        </Text>
                        <View style={style.userAchievement}>
                            <EvilIcons name='trophy' style={style.trophy} />
                            <Text style={style.userAchievementTitle}>Day {currentDay} of 90</Text>
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