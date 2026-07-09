import { View, Text } from 'react-native'
import React from 'react'
import { useSettingStyles } from '../../hook/useThemeStyles'

const Header = () => {
    const style = useSettingStyles();
    return (
        <View style={style.header}>
            <View style={style.headerTextContainer}>
                <Text style={style.headerTitle}>Settings</Text>
                <Text style={style.headerDesc}>Manage your profile and preferences</Text>
            </View>
        </View>
    )
}

export default Header