import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useSettingStyles } from '../../hook/useThemeStyles'
import { useEffect, useState } from 'react';
import { setDarkTheme, setLightTheme, toggleTheme } from '../../redux/slices/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';
import { storage } from '../../utils/storage';

const Appearance = () => {
    const style = useSettingStyles();
    const [myTheme, setMyTheme] = useState(1);
    const dispatch = useDispatch();
    let colorScheme = useColorScheme();
    console.log("Current system theme: ", colorScheme);

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

    useEffect(() => {
        async function loadTheme() {
            const pastTheme = await storage.get("darkTheme");

            switch (pastTheme) {
                case "dark":
                    setMyTheme(2);
                    break;

                case "light":
                    setMyTheme(1);
                    break;

                case "system":
                    setMyTheme(3);
                    break;

                default:
                    setMyTheme(3);
            }
        }

        loadTheme();
    }, []);

    console.log("Initial theme: ", storage.get("darkTheme"));

    const handleTheme = (themeId) => {

        switch (themeId) {
            case 1:
                handleLightTheme();
                break;

            case 2:
                handleDarkTheme();
                break;

            case 3:
                handleSystemTheme(colorScheme);
                break;

            default:
                console.log("Error: select valid theme!");
                break;
        }

    };

    async function handleDarkTheme() {
        setMyTheme(2);
        await storage.set("darkTheme", "dark");
        dispatch(setDarkTheme());
    }

    async function handleLightTheme() {
        setMyTheme(1);
        await storage.set("darkTheme", "light");
        dispatch(setLightTheme());
    }

    async function handleSystemTheme(colorScheme) {

        setMyTheme(3);
        if (colorScheme === "dark") {
            dispatch(setDarkTheme());
        } else {
            dispatch(setLightTheme());
        }
        await storage.set("darkTheme", "system");

    }

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