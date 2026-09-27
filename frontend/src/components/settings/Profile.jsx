import { EvilIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSettingStyles } from '../../hook/useThemeStyles';
import { setUserEmail, setUserName } from '../../redux/slices/appSlice';
import { storage } from '../../utils/storage';

const Profile = () => {
    const style = useSettingStyles();
    const dispatch = useDispatch();
    const currentDay = useSelector((state) => state.app.currentDay);
    const userFullName = useSelector((state) => state.app.userName);
    const userEmail = useSelector((state) => state.app.userEmail)

    console.log("User Full Name in Profile: ", userFullName);
    console.log("User Full Name in Profile: ", userEmail);

    useEffect(() => {
        const fetchUserNameEmail = async () => {
            if (userFullName && userEmail) return;

            if (!userFullName || !userEmail) {
                const cachedUser = await storage.get("@ninety_user");

                if (!cachedUser) {
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

    const getInitials = (fullName) => {
        if (!fullName) return '';

        return fullName
            .trim()
            .split(/\s+/)
            .map((word) => word[0].toUpperCase())
            .join('');
    };

    return (
        <View>
            <Text style={style.componentTitle}>PROFILE</Text>

            <View style={style.profileContainer}>
                <View style={style.profileLeft}>

                    <View style={style.profileDp}>
                        <Text style={style.profileDpLetters}>
                            {getInitials(userFullName)}
                        </Text>
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