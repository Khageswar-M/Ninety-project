import { View, Text, ScrollView, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SubPages = ({
    title,
    children
}) => {
    const style = useSettingStyles();
    const inset = useSafeAreaInsets();
    return (
        <View style={[style.editProfilePage, { paddingTop: inset.top }]}>

            <View style={style.editNameHeaderContainer}>

                <Pressable
                    style={style.editNameBackBtn}
                    onPress={() => router.back()}
                >
                    <Ionicons name='arrow-back' style={style.editNameBackBtnIcon} />
                </Pressable>

                <Text style={style.editNamePageTitle}>{title}</Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
                {children}
            </ScrollView>
        </View>
    )
}

export default SubPages