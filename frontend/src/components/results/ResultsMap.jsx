import { View, Text } from 'react-native';
import { useResultStyles } from '../../hook/useThemeStyles';
import { useEffect, useState } from 'react';
import { getChallenges } from '../../API/challenge/challengesApi';
import { storage } from '../../utils/storage';

const ResultsMap = ({refreshKey}) => {
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

            console.log('USER:', user);

            if (!user?.id) {
                console.log('No user found in storage');
                setChallenges([]);
                return;
            }

            const response = await getChallenges(user.id);

            console.log('CHALLENGES RESPONSE:', response);

            if (!response?.success) {
                throw new Error(
                    response?.message || 'Failed to load challenges'
                );
            }

            setChallenges(response.data || []);

        } catch (error) {
            console.error('Failed to fetch challenges:', error);
            console.error('Message:', error?.message);
            console.error('Response:', error?.response?.data);

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
            ) : (
                challenges.map((challenge) => {

                    const flatGrid = Array.isArray(challenge.dayGrid)
                        ? challenge.dayGrid.flat()
                        : [];

                    return (
                        <View key={challenge.id}>

                            <View style={style.mapContainer}>
                                {flatGrid.map((cell, index) => (
                                    <View
                                        key={`${challenge.id}-${index}`}
                                        style={[
                                            style.colMap,

                                            cell
                                                ? style.completeCell
                                                : index < challenge.currentDay - 1
                                                    ? style.notCompleteCell
                                                    : null,
                                        ]}
                                    />
                                ))}
                            </View>

                        </View>
                    );
                })
            )}
        </View>
    );
};

export default ResultsMap;4