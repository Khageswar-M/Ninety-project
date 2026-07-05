import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Text } from 'react-native'
import React from 'react'
import Actions from '../../src/components/screens/Actions'
import Results from '../../src/components/screens/Results'
import Settings from '../../src/components/screens/Settings'
import Dev from '../../src/components/screens/Dev'

const Tab = createMaterialTopTabNavigator();

const _layout = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen
            name='actions'
            component={Actions}
        />

        <Tab.Screen
            name='results'
            component={Results}
        />

        <Tab.Screen
            name='settings'
            component={Settings}
        />

        <Tab.Screen
            name='dev'
            component={Dev}
        />
    </Tab.Navigator>
  )
}

export default _layout