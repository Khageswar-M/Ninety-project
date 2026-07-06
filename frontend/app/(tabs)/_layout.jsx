import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Actions from '../../src/components/screens/Actions.jsx'
import Results from '../../src/components/screens/Results.jsx'
import Settings from '../../src/components/screens/Settings.jsx'
import { useSelector } from 'react-redux'
import SplashScreen from '../../src/components/splash/SplashScreen.jsx'
import { Fonts } from '../../src/constants/Fonts.js'
import { Ionicons, Feather } from '@expo/vector-icons'

const Tab = createMaterialTopTabNavigator();

const _layout = () => {
    const inset = useSafeAreaInsets();
    const currTheme = useSelector((state) => state.theme.theme);
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowIcon: true,
                tabBarStyle: {
                    backgroundColor: currTheme.background,
                    paddingTop: inset.top,
                },
                tabBarActiveTintColor: currTheme.text,
                tabBarInactiveTintColor: currTheme.textMuted,
                tabBarIndicatorStyle: {
                    backgroundColor: currTheme.primary,
                    width: "70%",
                    margin: 'auto'
                },
                tabBarLabelStyle: {
                    fontFamily: Fonts.poppins,
                    fontWeight: 'bold',
                    fontSize: 12
                },
            }}
        >
            <Tab.Screen
                name='Actions'
                component={Actions}
                options={{
                    tabBarIcon: ({color, focused}) => (
                        <Feather
                            name={"check-square"}
                            size={20}
                            color={color}
                        />
                    )
                }}
            />

            <Tab.Screen
                name='Results'
                component={Results}
                options={{
                    tabBarIcon: ({color, focused}) => (
                        <Feather
                            name={"bar-chart-2"}
                            size={20}
                            color={color}
                        />
                    )
                }}
            />

            <Tab.Screen
                name='Settings'
                component={Settings}
                options={{
                    tabBarIcon: ({color, focused}) => (
                        <Feather
                            name={"settings"}
                            size={20}
                            color={color}
                        />
                    )
                }}
            />
        </Tab.Navigator >
    )
}

export default _layout;