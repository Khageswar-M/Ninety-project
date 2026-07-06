import { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
// UTILS
import { board } from '../../utils/RawData';
// HOOKS
import { useActionStyles } from '../../hook/useThemeStyles';
// REDUX
import { useSelector } from 'react-redux';
// ICON
import { Ionicons } from '@expo/vector-icons';

const ChallengeBoard = () => {
    const style = useActionStyles();
    const challengeBoard = board;
    const theme = useSelector((state) => state.theme.theme);

    // 1. Create an array of 90 Animated Values (10 rows * 9 columns)
    // We use .current so it only generates once on mount
    const animatedValues = useRef(
        Array.from({ length: 90 }).map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        // 2. Define the animation for a single cell (takes 500ms)
        const animations = animatedValues.map((anim) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false, // Must be false for backgroundColor interpolation
            })
        );

        // 3. Stagger fires each animation with a 30ms delay between them
        Animated.stagger(30, animations).start();
    }, [animatedValues]);

    return (
        <View>
            <Text style={style.boardTitle}>BOARD</Text>
            <View style={style.boardContainer}>
                {
                    challengeBoard.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={style.row}>
                            {
                                row.map((collValue, collIndex) => {
                                    // Calculate 1D index (0 to 89) to grab the correct Animated.Value
                                    // Note: Multiplied by 9 (columns), not 10, so the numbers flow correctly!
                                    const cellIndex = (rowIndex * 9) + collIndex;

                                    // 4. Interpolate from a neutral/invisible state to the target color
                                    const targetColor = collValue ? theme.primary : theme.dark;

                                    const animatedBgColor = animatedValues[cellIndex].interpolate({
                                        inputRange: [0, 1],
                                        // Start transparent (or a neutral color), animate to final color
                                        outputRange: [theme.backgroundMutedExtra, targetColor]
                                    });

                                    return (
                                        // 5. Change View to Animated.View
                                        <Animated.View
                                            key={`coll-${rowIndex}-${collIndex}`}
                                            style={[
                                                style.coll,
                                                cellIndex === 8 ? style.cellWillCheckToday : 
                                                    cellIndex > 8 && !collValue ? style.cellWillCheck : 
                                                        cellIndex < 8 && !collValue ? style.cellNotChecked : style.cellChecked,
                                                {
                                                    backgroundColor: animatedBgColor,
                                                    // Safely apply border color without boolean injection
                                                    // borderColor: cellIndex === 8 ? theme.successLight : theme.border
                                                }
                                            ]}
                                        >
                                            <Text style={style.collIndexText}>
                                                {collValue ? (
                                                    <Ionicons name='checkmark-outline' size={20} />
                                                ) : (
                                                    cellIndex + 1 // Reused the fixed math here for accuracy!
                                                )}
                                            </Text>
                                        </Animated.View>
                                    )
                                })
                            }
                        </View>
                    ))
                }
            </View>
            <View style={style.lastCheckContainer}>
                <Ionicons name='checkmark-outline' size={20} color={'#1eff00'} />
                <Text style={style.lastCheck}>
                    <Text>Last Check: </Text>
                    Yesterday / 12:00PM
                </Text>
            </View>
        </View>
    )
}

export default ChallengeBoard;