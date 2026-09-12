import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Fetching from '../../../assets/icons/seeking-development.json';
import { createNewChallenge, getChallenges } from '../../API/challenge/challengesApi';
import { useActionStyles } from '../../hook/useThemeStyles';
import { setCurrentDay, setDayGrid, setGridId } from '../../redux/slices/appSlice';
import { storage } from '../../utils/storage';
import CellDetailsModal from '../modals/CellDetailsModal';

const COLS = 10;
const toCellIndex = (rowIndex, collIndex) => (rowIndex * COLS) + collIndex; // 0-indexed
const toDayNumber = (rowIndex, collIndex) => toCellIndex(rowIndex, collIndex) + 1; // 1-indexed

const ChallengeBoard = ({ refreshTrigger }) => {

    const dispatch = useDispatch();
    const style = useActionStyles();
    const theme = useSelector((state) => state.theme.theme);

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const [selectedCell, setSelectedCell] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [cellChecked, setCellChecked] = useState([]);
    const [currentDay, setLocalCurrentDay] = useState(0);
    const [cellActions, setCellActions] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadChallenge();
    }, [refreshTrigger])


    const loadChallenge = async () => {
        setLoading(true);

        try {
            const storedChallenge = await storage.get("@ninety_board");

            // -----------------------------------------
            // 1. Try today's cached challenge first
            // -----------------------------------------
            if (storedChallenge) {
                const now = new Date();
                const expiredAt = new Date(storedChallenge.expired);

                if (now < expiredAt) {
                    setCellChecked(storedChallenge.challengeBoard);
                    setLocalCurrentDay(storedChallenge.currentDay);

                    dispatch(
                        setGridId(storedChallenge.challengeId)
                    );

                    dispatch(
                        setDayGrid(storedChallenge.challengeBoard)
                    );

                    dispatch(
                        setCurrentDay(storedChallenge.currentDay)
                    );

                    return;
                }
            }

            // -----------------------------------------
            // 2. Get logged-in user
            // -----------------------------------------
            const user = await storage.get("@ninety_user");


            if (!user?.id) {
                router.replace("(auth)/LoginPage");
                return;
            }

            const id = user.id;

            // -----------------------------------------
            // 3. Fetch challenges from backend
            // -----------------------------------------
            const response = await getChallenges(id);

            if (!response?.success) {
                throw new Error(
                    response?.message || "Failed to load challenges"
                );
            }

            const challenges = response?.data || [];

            // -----------------------------------------
            // 4. Select the first incomplete challenge
            // -----------------------------------------
            const challenge = challenges.find(
                challenge => !challenge.completed
            );

            // No incomplete challenge exists
            if (!challenge) {
                console.log("No incomplete challenge found.");

                setCellChecked(null);
                setLocalCurrentDay(null);

                dispatch(setGridId(null));
                dispatch(setDayGrid(null));
                dispatch(setCurrentDay(null));

                return;
            }

            console.log("Still execute")

            // -----------------------------------------
            // 5. Local state
            // -----------------------------------------
            setCellChecked(challenge.dayGrid);
            setLocalCurrentDay(challenge.currentDay);

            // -----------------------------------------
            // 6. Redux state
            // -----------------------------------------
            dispatch(
                setGridId(challenge.id)
            );

            dispatch(
                setDayGrid(challenge.dayGrid)
            );

            dispatch(
                setCurrentDay(challenge.currentDay)
            );

            // -----------------------------------------
            // 7. Cache today's challenge
            // -----------------------------------------
            const expiresAt = new Date();


            // Every day expired at 12:00 AM
            expiresAt.setHours(
                23,
                59,
                59,
                999
            );

            const board = {
                challengeId: challenge.id,
                challengeBoard: challenge.dayGrid,
                currentDay: challenge.currentDay,
                expired: expiresAt.toISOString(),
            };

            await storage.set(
                "@ninety_board",
                board
            );

        } catch (error) {
            console.error(
                "Failed to load challenge data:",
                error
            );
        } finally {
            setLoading(false);
        }
    };



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
    // cellIndex must always be the 0-indexed (rowIndex * COLS + collIndex) value.
    const getCellStatus = (cellIndex, isChecked) => {
        const currentIndex = currentDay - 1;

        if (cellIndex === currentIndex) return 'current';

        if (cellIndex < currentIndex) {
            return isChecked ? 'checked' : 'missed';
        }

        return 'future';
    };

    const openCell = (rowIndex, collIndex) => {
        const cellIndex = toCellIndex(rowIndex, collIndex); // 0-indexed, matches render loop
        const isChecked = cellChecked[rowIndex][collIndex];
        const status = getCellStatus(cellIndex, isChecked);

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

        const cellIndex = toCellIndex(
            selectedCell.row,
            selectedCell.col
        );

        // 1-indexed
        const dayNumber = cellIndex + 1;

        // Save actions for this cell
        setCellActions(prev => ({
            ...prev,
            [key]: actions,
        }));

        // If the selected cell is today's cell,
        // mark today's cell as completed.
        if (dayNumber === currentDay) {
            markCurrentDayCompleted();
        }

        closeModal();
    };

    const handleCreateChallenge = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await createNewChallenge();

            if (response?.data?.success) {
                await loadChallenge();
            } else {
                console.log("Failed to create new challenge: unexpected response", response?.data);
            }

        } catch (e) {
            console.log("Filed to create new challenge: ", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <Text style={style.boardTitle}>SPRINT</Text>


            <View style={style.boardContainer}>
                {

                    loading ? (

                        <View style={{
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <LottieView
                                source={Fetching}
                                autoPlay
                                loop={true}
                                style={{ height: 200, width: 200 }}
                            />
                        </View>
                    ) : cellChecked === null ? (
                        <View style={{
                            alignItems: 'center',
                            paddingVertical: 30,
                            gap: 12
                        }}>
                            <Ionicons name="add-circle-outline" size={48} color={theme.primary} />

                            <Text style={{ color: theme.light, fontSize: 14, textAlign: 'center' }}>
                                No active sprint right now.
                            </Text>

                            <Pressable
                                onPress={handleCreateChallenge}
                                disabled={loading}
                                style={{
                                    backgroundColor: theme.primary,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 8,
                                    opacity: loading ? 0.6 : 1
                                }}
                            >
                                <Text style={{ color: theme.light, fontWeight: '600' }}>
                                    {loading ? 'Creating...' : 'Start New Sprint'}
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        cellChecked.map((row, rowIndex) => (
                            <View key={`row-${rowIndex}`} style={style.row}>
                                {
                                    row.map((collValue, collIndex) => {

                                        const cellIndex = toCellIndex(rowIndex, collIndex);
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
                    )
                }
            </View>
            {/* <View style={style.lastCheckContainer}>
                <Ionicons name='checkmark-outline' size={20} color={'#1eff00'} />
                <Text style={style.lastCheck}>
                    <Text>Last Check: </Text>
                    Yesterday / 12:00PM
                </Text>
            </View> */}



            <CellDetailsModal
                isVisible={isModalVisible}
                onCancel={closeModal}
                onAction={saveCellActions}
                title={
                    selectedCell
                        ? `Day ${toDayNumber(selectedCell.row, selectedCell.col)}`
                        : ""
                }
                dayNumber={
                    selectedCell ? toDayNumber(selectedCell.row, selectedCell.col) : 1
                }
                initialActions={
                    selectedCell
                        ? cellActions[
                        `${selectedCell.row}-${selectedCell.col}`
                        ] || []
                        : []
                }
                currentDay={currentDay}
                actionBoard={cellChecked}
                setActionBoard={setCellChecked}
            />
        </View >
    )
}

export default ChallengeBoard;