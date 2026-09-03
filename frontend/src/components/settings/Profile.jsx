import { View, Text } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { Ionicons, EvilIcons, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { storage } from '../../utils/storage';
import { setUserName, setUserEmail } from '../../redux/slices/appSlice';

const Profile = () => {
    const style = useSettingStyles();
    const dispatch = useDispatch();
    const currentDay = useSelector((state) => state.app.currentDay);
    const userFullName = useSelector((state) => state.app.userName);
    const userEmail = useSelector((state) => state.app.userEmail)

    console.log("User Full Name in Profile: ",userFullName); 
    console.log("User Full Name in Profile: ",userEmail);

    useEffect(() => {
        const fetchUserNameEmail = async () => {
            if(userFullName && userEmail) return;

            if(!userFullName || !userEmail){
                const cachedUser = await storage.get("@ninety_user");

                if(!cachedUser){
                    router.replace('/(auth)/LoginPage')
                    return;
                }

                const cachedUserName = cachedUser.fullName;
                const cachedUserEmail = cachedUser.email;

                dispatch(setUserName(cachedUserName))
                dispatch(setUserEmail(cachedUserEmail))
            }
        }

        fetchUserNameEmail();
    }, [])

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