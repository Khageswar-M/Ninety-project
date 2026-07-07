import { View, Text } from 'react-native'
import React from 'react'
import { useResultStyles } from '../../hook/useThemeStyles'

const Header = () => {
    const style = useResultStyles();
    return (
        <View style={style.header}>
            <View style={style.headerTextContainer}>
                <Text style={style.headerTitle}>Results</Text>
                <Text style={style.headerDesc}>Your 90 day progress</Text>
            </View>

            <View style={style.headerTotalDay}>
                <Text style={style.totalDayText}>Day 23</Text>
            </View>
        </View>
    )
}

export default Header