import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { board, currentStreakIndex } from '../../utils/RawData';
import { useActionStyles } from '../../hook/useThemeStyles';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import CellDetailsModal from '../modals/CellDetailsModal';
import { storage } from '../../utils/storage';

const ChallengeBoard = () => {
    const style = useActionStyles();
    const theme = useSelector((state) => state.theme.theme);

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const [selectedCell, setSelectedCell] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [cellChecked, setCellChecked] = useState([]);
    const [currentDay, setCurrentDay] = useState(0);
    const [cellActions, setCellActions] = useState({});

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const user = await storage.get("@ninety_user");

                if (!user) {
                    console.log("No user found in storage.");
                    return;
                }

                console.log("Ninety user:", user);

                const challenge = user.challenges?.[0];

                if (!challenge) {
                    console.log("No challenge found.");
                    return;
                }

                console.log("Day grid: ", challenge.dayGrid);
                console.log("Current day: ", challenge.currentDay);

                setCellChecked(challenge.dayGrid);
                setCurrentDay(challenge.currentDay);
            } catch (error) {
                console.error("Failed to load challenge data: ", error);
            }
        }

        loadUserData();
    }, [])

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

    // Single source of truth for a cell's state — derived, not stored.
    const getCellStatus = (cellIndex, isChecked) => {

        const currentIndex = currentDay - 1;

        if (cellIndex === currentIndex) return 'current';

        if (cellIndex < currentIndex) {
            return isChecked ? 'checked' : 'missed';
        }

        return 'future';
    };

    const openCell = (rowIndex, collIndex) => {
        const cellIndex = (rowIndex * 9) + collIndex;
        const status = getCellStatus(cellIndex, cellChecked[rowIndex][collIndex]);

        if (status !== 'checked' && status !== 'current') return;

        setSelectedCell({ row: rowIndex, col: collIndex });
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedCell(null);
    };

    const saveCellActions = (actions) => {
        if (!selectedCell) return;

        const key = `${selectedCell.row}-${selectedCell.col}`;
        const cellIndex = (selectedCell.row * 9) + selectedCell.col;

        setCellActions((prev) => ({
            ...prev,
            [key]: actions,
        }));

        if (cellIndex === currentDay) {
            setCellChecked((prev) => {
                const next = prev.map((r) => [...r]);
                next[selectedCell.row][selectedCell.col] = true;
                return next;
            });
        }

        closeModal();
    };

    return (
        <View>
            <Text style={style.boardTitle}>BOARD</Text>
            <View style={style.boardContainer}>
                {
                    cellChecked.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={style.row}>
                            {
                                row.map((collValue, collIndex) => {

                                    const cellIndex = (rowIndex * 10) + collIndex ;
                                    const status = getCellStatus(cellIndex, collValue);
                                    const isEditable = status === 'current' || status === 'checked';

                                    const targetColor =
                                        status === 'checked' ? theme.primary :
                                            status === 'current' ? (theme.success) :
                                                status === 'missed' ? (theme.danger) :
                                                    theme.dark;

                                    const animatedBgColor = animatedValues[cellIndex].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [theme.backgroundMutedExtra, targetColor]
                                    });

                                    const cellStyle =
                                        status === 'checked' ? style.cellChecked :
                                            status === 'current' ? style.cellWillCheckToday :
                                                status === 'missed' ? style.cellMissed :
                                                    style.cellWillCheck;

                                    return (
                                        <AnimatedPressable
                                            key={`coll-${rowIndex}-${collIndex}`}
                                            disabled={!isEditable}
                                            style={[
                                                style.coll,
                                                cellStyle,
                                                {
                                                    backgroundColor: animatedBgColor,
                                                    opacity: status === 'future' ? 0.5 : 1,
                                                }
                                            ]}
                                            onPress={() => openCell(rowIndex, collIndex)}
                                        >
                                            <Text style={style.collIndexText}>
                                                {status === 'checked' ? (
                                                    <Ionicons name='checkmark-outline' size={20} color={theme.light} />
                                                ) : status === 'missed' ? (
                                                    <Ionicons name='close-outline' size={20} color={theme.light} />
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