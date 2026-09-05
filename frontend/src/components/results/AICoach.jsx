import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

import { aiCoachSuggestion } from '../../API/AiCoach/aiCoachApi';
import { useResultStyles } from '../../hook/useThemeStyles';
import { storage } from '../../utils/storage';
import { mockCoachData } from '../../utils/MockCoachData';
import LottieView from 'lottie-react-native';
import GeminiGif from '../../../assets/icons/gemini-looping.json';
import GeminiIcon from '../../../assets/icons/google-gemini.png'

const STATUS_CONFIG = {
    COMPLETE: { label: 'Complete', bg: '#ff8000', text: '#fff', dot: '#2ECC71' },
    PROGRESS: { label: 'In Progress', bg: '#c36100', text: '#fff', dot: '#F5A623' },
    PENDING: { label: 'Pending', bg: "#753a00", text: '#fff', dot: '#E74C3C' },
};

const getStatusConfig = (status) =>
    STATUS_CONFIG[status?.toUpperCase()] || {
        label: status || 'Unknown',
        bg: '#EFEFEF',
        text: '#555',
        dot: '#999',
    };

// Parses just the aiMessage STRING, e.g.:
// 'Khageswar, you built ...momentum...\n"Success is the sum..." - Robert Collier'
// Returns { message, quote, author }
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

// Normalizes the FULL API envelope into the flat shape the UI expects.
// raw looks like:
// { success, message, data: { data: { challenge, activities, goals, user }, aiMessage }, timestamp }
const normalizeCoachData = (raw) => {
    const inner = raw?.data?.data || {};
    const aiMessage = raw?.data?.aiMessage;

    const { message, quote, author } = parseAiMessage(aiMessage);

    return {
        challenge: inner.challenge || [],
        activities: inner.activities || [],
        goals: inner.goals || [],
        user: inner.user || null,
        message,
        quote,
        author,
    };
};

// Guards against a stale/bad cache entry (e.g. one written before this shape existed)
const isValidCoachData = (d) =>
    !!d && Array.isArray(d.activities) && Array.isArray(d.goals);

const formatDayLabel = (day) => `Day ${day}`;

const AICoach = ({ refreshKey }) => {
    const style = useResultStyles();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coachData, setCoachData] = useState(null);

    const COACH_DATA_KEY = 'AI_COACH_DATA_V2'; // bumped: old key held the pre-normalized shape
    const CACHE_DURATION = 12 * 60 * 60 * 1000;

    const fetchCoachData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const cachedData = await storage.get(COACH_DATA_KEY);

            if (cachedData) {
                const isFresh = Date.now() < cachedData.expiredAt;

                if (isFresh && isValidCoachData(cachedData.data)) {
                    console.log("Using AI coach data from storage");
                    setCoachData(cachedData.data);
                    return;
                }

                console.log("AI coach cache expired or invalid, refetching");
                await storage.remove(COACH_DATA_KEY);
            }

            const rawResponse = await aiCoachSuggestion();
            // aiCoachSuggestion() returns the axios response object —
            // the actual API body (success/message/data/timestamp) is on .data
            const newCoachData = normalizeCoachData(rawResponse.data);

            console.log("Normalized AI coach data:", newCoachData);

            setCoachData(newCoachData);

            await storage.set(COACH_DATA_KEY, {
                data: newCoachData, // cache the normalized shape, not the raw envelope
                expiredAt: Date.now() + CACHE_DURATION,
            });

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

            <View style={[style.aiCoachContainer, style.aiContainer]}>
                {/* Header */}
                <View style={style.aiCoachHeader}>
                    <Image
                        source={GeminiIcon}
                        style={{
                            height: 30,
                            width: 30
                        }}
                        resizeMode='contain'
                    />
                    <Text style={style.aiCoachHeaderTitle}>
                        Today's Insights
                    </Text>
                </View>

                {/* Loading state */}
                {loading && (
                    <View style={style.centerBox}>
                        <LottieView
                            source={GeminiGif}
                            autoPlay
                            loop={true}
                            style={{ height: 150, width: 150 }}
                        />
                        <Text style={style.loadingText}>
                            Generating your insights.....
                        </Text>
                    </View>
                )}

                {/* Error state */}
                {!loading && error && (
                    <View style={style.centerBox}>
                        <Ionicons name="alert-circle-outline" size={22} color="#C0392B" />
                        <Text style={style.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={style.retryBtn}
                            activeOpacity={0.7}
                            onPress={fetchCoachData}
                        >
                            <Ionicons name="refresh" size={16} color="#fff" />
                            <Text style={style.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Content */}
                {!loading && !error && coachData && (
                    <View>
                        {/* Activities */}
                        {(coachData.activities || []).length > 0 && (
                            <View style={style.section}>
                                <Text style={style.sectionTitle}>Recent Activities</Text>
                                {coachData.activities.map((dayEntry) => (
                                    <View key={`day-${dayEntry.day}`} style={style.dayBlock}>
                                        <Text style={style.dayLabel}>
                                            {formatDayLabel(dayEntry.day)}
                                        </Text>
                                        <View style={style.chipWrap}>
                                            {(dayEntry.activities || []).map((activity, idx) => (
                                                <View
                                                    key={`activity-${dayEntry.day}-${idx}`}
                                                    style={style.activityChip}
                                                >
                                                    <Text style={style.activityChipText}>
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
                        {(coachData.goals || []).length > 0 && (
                            <View style={style.section}>
                                <Text style={style.sectionTitle}>Goals</Text>
                                <View style={style.chipWrap}>
                                    {[...coachData.goals]
                                        .sort((a, b) => {
                                            const priority = {
                                                PENDING: 1,
                                                PROGRESS: 2,
                                                COMPLETE: 3,
                                            };

                                            return priority[a.status] - priority[b.status];
                                        })
                                        .map((goal, idx) => {
                                            const cfg = getStatusConfig(goal.status);
                                            return (
                                                <View
                                                    key={`goal-${idx}`}
                                                    style={[
                                                        style.goalChip,
                                                        { backgroundColor: cfg.bg },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            style.goalChipText,
                                                            { color: cfg.text },
                                                            cfg.label === 'Complete' && {
                                                                textDecorationLine: "line-through"
                                                            }
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
                            <View style={style.section}>
                                <Text style={style.messageText}>{coachData.message}</Text>
                            </View>
                        ) : null}

                        {/* Quote box */}
                        {coachData.quote ? (
                            <View style={style.quoteBox}>
                                <Text style={style.quoteText}>"{coachData.quote}"</Text>
                                {coachData.author ? (
                                    <Text style={style.quoteAuthor}>— {coachData.author}</Text>
                                ) : null}
                            </View>
                        ) : null}

                    </View>
                )}

                {/* Empty state (no error, no loading, but nothing to show) */}
                {!loading &&
                    !error &&
                    coachData &&
                    (coachData.activities || []).length === 0 &&
                    (coachData.goals || []).length === 0 &&
                    !coachData.message && (
                        <View style={style.centerBox}>
                            <Text style={style.emptyText}>
                                No insights yet — check in on your challenge to get started.
                            </Text>
                        </View>
                    )}
            </View>
        </View>
    );
};

export default AICoach;