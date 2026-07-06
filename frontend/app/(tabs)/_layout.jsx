import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Actions from '../../src/components/screens/Actions.jsx'
import Results from '../../src/components/screens/Results.jsx'
import Settings from '../../src/components/screens/Settings.jsx'
import Dev from '../../src/components/screens/Dev.jsx'
import { useSelector } from 'react-redux'

const Tab = createMaterialTopTabNavigator();

const _layout = () => {
    const inset = useSafeAreaInsets();
    const currTheme = useSelector((state) => state.theme.theme);
    const isDev = true;
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: currTheme.background,
                    paddingTop: inset.top,
                },
                tabBarActiveTintColor: currTheme.text,
                tabBarInactiveTintColor: currTheme.textMuted,
                tabBarIndicatorStyle: {
                    backgroundColor: currTheme.primary
                }

            }}
        >
            <Tab.Screen
                name='Actions'
                component={Actions}
            />

            <Tab.Screen
                name='Results'
                component={Results}
            />

            <Tab.Screen
                name='Settings'
                component={Settings}
            />

            {
                isDev && (
                    <Tab.Screen
                        name='Dev'
                        component={Dev}
                    />
                )
            }

        </Tab.Navigator>
    )
}

export default _layout;