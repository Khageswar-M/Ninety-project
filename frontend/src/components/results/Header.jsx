import { View, Text } from 'react-native'
import React from 'react'
import { useResultStyles } from '../../hook/useThemeStyles'
import { useSelector } from 'react-redux';

const Header = () => {
    const style = useResultStyles();
    const currentDay = useSelector((state) => state.app.currentDay);
    return (
        <View style={style.header}>
            <View style={style.headerTextContainer}>
                <Text style={style.headerTitle}>Results</Text>
                <Text style={style.headerDesc}>Your 90 day progress</Text>
            </View>

            <View style={style.headerTotalDay}>
                <Text style={style.totalDayText}>Day {currentDay}</Text>
            </View>
        </View>
    )
}

export default Header