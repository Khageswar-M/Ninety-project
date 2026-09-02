import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { aiCoachSuggestion } from '../../API/AiCoach/aiCoachApi';
import { useResultStyles } from '../../hook/useThemeStyles';
import { storage } from '../../utils/storage';

const STATUS_CONFIG = {
    COMPLETE: { label: 'Complete', bg: '#E6F7EC', text: '#1E8E4E', dot: '#2ECC71' },
    PROGRESS: { label: 'In Progress', bg: '#FFF4E5', text: '#B7791F', dot: '#F5A623' },
    PENDING: { label: 'Pending', bg: '#FDECEC', text: '#C0392B', dot: '#E74C3C' },
};

const getStatusConfig = (status) =>
    STATUS_CONFIG[status?.toUpperCase()] || {
        label: status || 'Unknown',
        bg: '#EFEFEF',
        text: '#555',
        dot: '#999',
    };

// aiMessage looks like:
// 'Khageswar, you built ...momentum...\n"Success is the sum..." - Robert Collier'
const parseAiMessage = (aiMessage) => {
    if (!aiMessage || typeof aiMessage !== 'string') {
        return { message: '', quote: '', author: '' };
    }

    const lines = aiMessage.split('\n').filter(Boolean);
    const message = lines[0]?.trim() || '';
    const quoteLine = lines.slice(1).join(' ').trim();

    if (!quoteLine) {
        return { message, quote: '', author: '' };
    }

    // Match: "quote text" - Author
    const match = quoteLine.match(/^"?(.+?)"?\s*-\s*(.+)$/);
    if (match) {
        return { message, quote: match[1].trim(), author: match[2].trim() };
    }

    return { message, quote: quoteLine, author: '' };
};

const formatDayLabel = (day) => `Day ${day}`;



const AICoach = ({ refreshKey }) => {
    const style = useResultStyles();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coachData, setCoachData] = useState(null);

    const COACH_DATA_KEY = 'AI_COACH_DATA';
    const CACHE_DURATION = 12 * 60 * 60 * 1000;

    const fetchCoachData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {

            // Check cached data
            const cachedData = await storage.get(COACH_DATA_KEY);

            if (cachedData) {
                const isValid = Date.now() >= cachedData.expiredAt;

                if (isValid) {
                    console.log("Using AI coach data from storage");

                    setCoachData(cachedData.data);
                    return;
                }

                // Cache expired
                console.log("AI coach cache expired");

                await storage.remove(COACH_DATA_KEY);
            }


            const response = await aiCoachSuggestion();
            console.log(response);
            const payload = response?.data?.data;

            if (!payload) {
                throw new Error('Empty response from AI coach');
            }

            const { activities = [], goals = [], user } = payload.data || {};
            const { message, quote, author } = parseAiMessage(payload.aiMessage);

            setCoachData({
                userName: user?.name || '',
                activities,
                goals,
                message,
                quote,
                author,
            });

            //3. Store response + time stamp
            await storage.set(COACH_DATA_KEY, {
                data: coachData,
                expiredAt: Date.now() + CACHE_DURATION
            })
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Unable to load your AI coach insights right now.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCoachData();
    }, [fetchCoachData, refreshKey]);

    return (
        <View>
            <Text style={style.componentTitle}>AICoach</Text>

            <View style={[style.aiCoachContainer, localStyles.container]}>
                {/* Header */}
                <View style={style.aiCoachHeader}>
                    <Text style={style.aiCoachHeaderTitle}>
                        <Ionicons name="sparkles-sharp" style={style.titleIcon} />{' '}
                        Today's Insights
                    </Text>
                </View>

                {/* Loading state */}
                {loading && (
                    <View style={localStyles.centerBox}>
                        <ActivityIndicator size="small" color="#F5A623" />
                        <Text style={localStyles.loadingText}>Fetching your insights...</Text>
                    </View>
                )}

                {/* Error state */}
                {!loading && error && (
                    <View style={localStyles.centerBox}>
                        <Ionicons name="alert-circle-outline" size={22} color="#C0392B" />
                        <Text style={localStyles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={localStyles.retryBtn}
                            activeOpacity={0.7}
                            onPress={fetchCoachData}
                        >
                            <Ionicons name="refresh" size={16} color="#fff" />
                            <Text style={localStyles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Content */}
                {!loading && !error && coachData && (
                    <View>
                        {/* Activities */}
                        {coachData.activities.length > 0 && (
                            <View style={localStyles.section}>
                                <Text style={localStyles.sectionTitle}>Recent Activities</Text>
                                {coachData.activities.map((dayEntry) => (
                                    <View key={`day-${dayEntry.day}`} style={localStyles.dayBlock}>
                                        <Text style={localStyles.dayLabel}>
                                            {formatDayLabel(dayEntry.day)}
                                        </Text>
                                        <View style={localStyles.chipWrap}>
                                            {(dayEntry.activities || []).map((activity, idx) => (
                                                <View
                                                    key={`activity-${dayEntry.day}-${idx}`}
                                                    style={localStyles.activityChip}
                                                >
                                                    <Text style={localStyles.activityChipText}>
                                                        {activity}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Goals */}
                        {coachData.goals.length > 0 && (
                            <View style={localStyles.section}>
                                <Text style={localStyles.sectionTitle}>Goals</Text>
                                <View style={localStyles.chipWrap}>
                                    {coachData.goals.map((goal, idx) => {
                                        const cfg = getStatusConfig(goal.status);
                                        return (
                                            <View
                                                key={`goal-${idx}`}
                                                style={[
                                                    localStyles.goalChip,
                                                    { backgroundColor: cfg.bg },
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        localStyles.goalDot,
                                                        { backgroundColor: cfg.dot },
                                                    ]}
                                                />
                                                <Text
                                                    style={[
                                                        localStyles.goalChipText,
                                                        { color: cfg.text },
                                                    ]}
                                                >
                                                    {goal.name}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {/* Motivational message */}
                        {coachData.message ? (
                            <View style={localStyles.section}>
                                <Text style={localStyles.messageText}>{coachData.message}</Text>
                            </View>
                        ) : null}

                        {/* Quote box */}
                        {coachData.quote ? (
                            <View style={localStyles.quoteBox}>
                                <Text style={localStyles.quoteText}>"{coachData.quote}"</Text>
                                {coachData.author ? (
                                    <Text style={localStyles.quoteAuthor}>— {coachData.author}</Text>
                                ) : null}
                            </View>
                        ) : null}
                    </View>
                )}

                {/* Empty state (no error, no loading, but nothing to show) */}
                {!loading &&
                    !error &&
                    coachData &&
                    coachData.activities.length === 0 &&
                    coachData.goals.length === 0 &&
                    !coachData.message && (
                        <View style={localStyles.centerBox}>
                            <Text style={localStyles.emptyText}>
                                No insights yet — check in on your challenge to get started.
                            </Text>
                        </View>
                    )}
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        paddingBottom: 4,
    },
    centerBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        gap: 8,
    },
    loadingText: {
        fontSize: 13,
        color: '#888',
    },
    errorText: {
        fontSize: 13,
        color: '#C0392B',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F5A623',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 4,
    },
    retryText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    section: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dayBlock: {
        marginBottom: 10,
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B7791F',
        marginBottom: 4,
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    activityChip: {
        backgroundColor: '#FFF1DE',
        borderWidth: 1,
        borderColor: '#ff9d00',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    activityChipText: {
        fontSize: 12,
        color: '#8A4B08',
        fontWeight: '500',
    },
    goalChip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    goalDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    goalChipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    quoteBox: {
        marginTop: 12,
        backgroundColor: '#FFF8EF',
        borderLeftWidth: 4,
        borderLeftColor: '#F5A623',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    quoteText: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#5A4632',
        lineHeight: 19,
    },
    quoteAuthor: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B7791F',
        marginTop: 6,
        textAlign: 'right',
    },
});

export default AICoach;