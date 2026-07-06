import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Actions from '../../src/components/screens/Actions.jsx'
import Results from '../../src/components/screens/Results.jsx'
import Settings from '../../src/components/screens/Settings.jsx'
import { useSelector } from 'react-redux'
import SplashScreen from '../../src/components/splash/SplashScreen.jsx'
import { Fonts } from '../../src/constants/Fonts.js'

const Tab = createMaterialTopTabNavigator();

const _layout = () => {
    const inset = useSafeAreaInsets();
    const currTheme = useSelector((state) => state.theme.theme);
    const isDev = true;
    const appLoading = false;
    return (
        <>
            {
                appLoading ? (
                    <SplashScreen />
                ) : (
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
                            },
                            tabBarLabelStyle: {
                                fontFamily: Fonts.poppins,
                                fontWeight: 'bold'
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
                    </Tab.Navigator >
                )
            }

        </>
    )
}

export default _layout;