import { TopTabs } from 'expo-router/js-top-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Feather } from '@expo/vector-icons'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { Fonts } from '../../src/constants/Fonts.js'

const TabLayout = () => {
    const inset = useSafeAreaInsets();
    const currTheme = useSelector((state) => state.theme.theme);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <TopTabs
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
                    <TopTabs.Screen
                        name='ActionsScreen'
                        options={{
                            tabBarLabel: 'Actions',
                            tabBarIcon: ({ color, focused }) => (
                                <Feather
                                    name={"check-square"}
                                    size={20}
                                    color={color}
                                />
                            )
                        }}
                    />

                    <TopTabs.Screen
                        name='ResultsScreen'
                        options={{
                            tabBarLabel: 'Results',
                            tabBarIcon: ({ color, focused }) => (
                                <Feather
                                    name={"bar-chart-2"}
                                    size={20}
                                    color={color}
                                />
                            )
                        }}
                    />

                    <TopTabs.Screen
                        name='SettingsScreen'
                        options={{
                            tabBarLabel: 'Settings',
                            tabBarIcon: ({ color, focused }) => (
                                <Feather
                                    name={"settings"}
                                    size={20}
                                    color={color}
                                />
                            )
                        }}
                    />
                </TopTabs>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default TabLayout;