import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { board } from '../../utils/RawData';
import { useActionStyles } from '../../hook/useThemeStyles';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import CellDetailsModal from '../modals/CellDetailsModal';


const ChallengeBoard = () => {
    const style = useActionStyles();
    const challengeBoard = board;
    const theme = useSelector((state) => state.theme.theme);

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const [selectedCell, setSelectedCell] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Stores actions for every cell
    const [cellActions, setCellActions] = useState({});

    const animatedValues = useRef(
        Array.from({ length: 90 }).map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            const animations = animatedValues.map((anim) =>
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                })
            );

            Animated.stagger(30, animations).start();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


    const openCell = (row, col) => {
        setSelectedCell({ row, col });
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedCell(null);
    };

    const saveCellActions = (actions) => {
        if (!selectedCell) return;

        const key = `${selectedCell.row}-${selectedCell.col}`;

        setCellActions((prev) => ({
            ...prev,
            [key]: actions,
        }));

        closeModal();
    };

    return (
        <View>
            <Text style={style.boardTitle}>BOARD</Text>
            <View style={style.boardContainer}>
                {
                    challengeBoard.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={style.row}>
                            {
                                row.map((collValue, collIndex) => {

                                    const cellIndex = (rowIndex * 9) + collIndex;

                                    const targetColor = collValue ? theme.primary : theme.dark;

                                    const animatedBgColor = animatedValues[cellIndex].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [theme.backgroundMutedExtra, targetColor]
                                    });

                                    return (
                                        // 5. Change View to Animated.View

                                        <AnimatedPressable
                                            key={`coll-${rowIndex}-${collIndex}`}
                                            style={[
                                                style.coll,
                                                cellIndex === 8 ? style.cellWillCheckToday :
                                                    cellIndex > 8 && !collValue ? style.cellWillCheck :
                                                        cellIndex < 8 && !collValue ? style.cellNotChecked : style.cellChecked,
                                                {
                                                    backgroundColor: animatedBgColor,
                                                }
                                            ]}

                                            onPress={() => openCell(rowIndex, collIndex)}

                                        >

                                            <Text style={style.collIndexText}>
                                                {collValue ? (
                                                    <Ionicons name='checkmark-outline' size={20} />
                                                ) : (
                                                    cellIndex + 1
                                                )}

                                            </Text>
                                        </AnimatedPressable>
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

            <CellDetailsModal
                isVisible={isModalVisible}
                onCancel={closeModal}
                onAction={saveCellActions}
                title={
                    selectedCell
                        ? `Day ${(selectedCell.row * 9) + selectedCell.col + 1}`
                        : ""
                }
                initialActions={
                    selectedCell
                        ? cellActions[
                        `${selectedCell.row}-${selectedCell.col}`
                        ] || []
                        : []
                }
            />
        </View>
    )
}

export default ChallengeBoard;