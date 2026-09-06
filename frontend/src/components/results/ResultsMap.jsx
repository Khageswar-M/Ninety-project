import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getChallenges } from '../../API/challenge/challengesApi';
import { useResultStyles } from '../../hook/useThemeStyles';
import { storage } from '../../utils/storage';

const completedChallengeData = [
    { id: 0, title: "STREAK", iconName: 'local-fire-department', color: '#ff8400' },
    { id: 1, title: "DONE", iconName: 'energy-savings-leaf', color: '#48ff00' },
    { id: 2, title: "MISSED", iconName: 'dangerous', color: '#ff0000' }
];

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
};

const ResultsMap = ({ refreshKey }) => {
    const style = useResultStyles();

    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllChallenges();
    }, [refreshKey]);

    const fetchAllChallenges = async () => {
        setLoading(true);

        try {
            const user = await storage.get('@ninety_user');

            if (!user?.id) {
                setChallenges([]);
                return;
            }

            const response = await getChallenges(user.id);

            if (!response?.success) {
                throw new Error(response?.message || 'Failed to load challenges');
            }

            setChallenges(response.data || []);

        } catch (error) {
            console.error('Failed to fetch challenges:', error?.message);
            setChallenges([]);

        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text style={style.componentTitle}>
                Challenge History
            </Text>

            {loading ? (
                <Text style={style.componentTitle}>
                    Loading...
                </Text>
            ) : challenges.length === 0 ? (
                <Text style={{ color: '#afaeae', textAlign: 'center', marginTop: 10 }}>
                    No challenges yet.
                </Text>
            ) : (
                challenges.map((challenge) => {

                    const flatGrid = Array.isArray(challenge.dayGrid)
                        ? challenge.dayGrid.flat()
                        : [];

                    const { longestStreak, completedCount, missedCount } = challenge;
                    const values = [longestStreak, completedCount, missedCount];

                    // Fallback to 0 in case currentDay is ever missing, so this
                    // never silently breaks back into "no red cells" mode.
                    const currentDay = challenge.currentDay || 0;

                    return (
                        <View key={challenge.id}
                            style={{
                                marginBottom: 10,
                                backgroundColor: '#262626',
                                flexDirection: 'column',
                                borderRadius: 5,
                                paddingHorizontal: 5,
                                paddingVertical: 5,
                                gap: 10
                            }}
                        >

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 5
                            }}>
                                <Text
                                    style={{ color: '#fff', fontSize: 14, fontWeight: '600', flexShrink: 1 }}
                                    numberOfLines={1}
                                >
                                    {challenge.title}
                                </Text>
                                <Text style={{ color: '#afaeae', fontSize: 10 }}>
                                    {formatDate(challenge.createdAt)}
                                </Text>
                            </View>

                            <View style={style.mapContainer}>
                                {flatGrid.map((cell, index) => (
                                    <View
                                        key={`${challenge.id}-${index}`}
                                        style={[
                                            style.colMap,

                                            cell
                                                ? style.completeCell
                                                : index < currentDay - 1
                                                    ? style.notCompleteCell
                                                    : null,
                                        ]}
                                    />
                                ))}
                            </View>

                            {challenge.completed &&

                                <View style={{
                                    flexDirection: 'column',
                                    gap: 5
                                }}>
                                    <View style={{
                                        height: 1,
                                        width: "95%",
                                        backgroundColor: '#4d4d4d',
                                        alignSelf: 'center'
                                    }} />

                                    <Text style={{
                                        color: '#afaeae',
                                        fontSize: 10,
                                        textAlign: 'center'
                                    }}>
                                        Completed on {formatDate(challenge.updatedAt)}
                                    </Text>

                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 10
                                    }}>

                                        {
                                            completedChallengeData.map((ccd, idx) => (
                                                <View
                                                    key={idx}
                                                    style={{
                                                        flexDirection: 'column',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <MaterialIcons name={ccd.iconName} size={25} color={ccd.color} />
                                                    <Text
                                                        style={{
                                                            fontSize: 8,
                                                            color: '#afaeae'
                                                        }}
                                                    >
                                                        {ccd.title}
                                                    </Text>

                                                    <Text style={{
                                                        fontSize: 18,
                                                        color: '#fff'
                                                    }}>
                                                        {values[idx]}
                                                    </Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                            }

                        </View>
                    );
                })
            )}
        </View>
    );
};

export default ResultsMap;