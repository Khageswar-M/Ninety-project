import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useSettingStyles } from '../../hook/useThemeStyles'
import { useState } from 'react';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { useDispatch, useSelector } from 'react-redux';

const Appearance = () => {
    const style = useSettingStyles();
    const [myTheme, setMyTheme] = useState(1);
    const dispatch = useDispatch();

    const themeItems = [
        {
            id: 1,
            title: "Light",
            background: ['#ffffff'],
        },
        {
            id: 2,
            title: "Dark",
            background: ['#000000'],
        },
        {
            id: 3,
            title: "Auto",
            background: ['#ffffff', '#000000'],
        },
    ]

    const isDark = useSelector((state) => state.theme.isDark);

    const handleTheme = () => {
        dispatch(toggleTheme());
        setMyTheme(isDark ? 1 : 2);
    };
    return (
        <View>
            <Text style={style.componentTitle}>Appearance</Text>

            <View style={style.notificationContainer}>
                <View style={style.notificationItem}>
                    <View style={style.notification}>
                        {/* ICON */}
                        <View style={style.challengeHeadingIconContainer}>
                            <Ionicons name="color-palette-outline" style={style.challengeHeadingIcon} />
                        </View>

                        {/* Title */}
                        <View style={style.challengeTitleContainer}>
                            <Text style={style.challengeTitle}>
                                Theme
                            </Text>
                            <Text style={style.challengeDesc}>
                                Choose your display mode
                            </Text>
                        </View>

                    </View>


                </View>

                <View style={style.themeButtonsContainer}>
                    {
                        themeItems.map((theme) => {
                            return (
                                <TouchableOpacity
                                    key={theme.id}
                                    style={[
                                        style.themeButton,
                                        myTheme === theme.id && {
                                            borderWidth: 2,
                                            borderColor: "#ff5e00",
                                        },
                                    ]}
                                    onPress={() => handleTheme(theme.id)}
                                >

                                    {
                                        theme.title === 'Auto' ? (
                                            <View style={[style.themeColorBtn, {
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }]} >
                                                <View style={[
                                                    { backgroundColor: theme.background[0], },
                                                    style.themeAutoPartLeft
                                                ]} />
                                                <View style={[
                                                    { backgroundColor: theme.background[1], },
                                                    style.themeAutoPartRight
                                                ]} />
                                            </View>
                                        ) : (
                                            <View style={[style.themeColorBtn, {
                                                backgroundColor: theme.background[0]
                                            },
                                            ]} />
                                        )
                                    }


                                    <Text style={[style.themeButtonTittleText],
                                        theme.id === myTheme ?
                                            style.themeBtnActive :
                                            style.themeBtnInactive}
                                    >
                                        {theme.title}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            </View>
        </View>
    )
}

export default Appearance