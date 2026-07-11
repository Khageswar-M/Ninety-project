import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useResultStyles } from '../../hook/useThemeStyles';
import TypewriterText from './TypewriterText';

const AICoach = ({refreshKey}) => {

    const style = useResultStyles();

    const message =
        "17 productive days out of 22 is solid but there's a gap. 5 missed days means you've left real progress on the table. Your best streak was 4 — go beat it. Today: write down the one thing that will make this day count, before you open your phone.";

    const quote =
        "Success is the sum of small efforts, repeated day in and day out.";

    const author = "— Robert Collier";

    const [showQuote, setShowQuote] = useState(false);
    const [showAuthor, setShowAuthor] = useState(false);
    const [showRefresh, setShowRefresh] = useState(false);

    const handleRefresh = () => {
        setShowQuote(false);
        setShowAuthor(false);
        setShowRefresh(false);

        // If your message changes on refresh,
        // update it here.
    };

    return (
        <View>

            <Text style={style.componentTitle}>
                AICoach
            </Text>

            <View style={style.aiCoachContainer}>

                {/* Header */}

                <View style={style.aiCoachHeader}>

                    <Text style={style.aiCoachHeaderTitle}>
                        <Ionicons
                            name="sparkles-sharp"
                            style={style.titleIcon}
                        />{" "}
                        Today's Insights
                    </Text>

                    <Text style={style.aiCoachHeaderTitle}>
                        08 JUL
                    </Text>

                </View>

                {/* AI Response */}

                <View style={style.aiCoachResponseContainer}>

                    <TypewriterText
                        text={message}
                        speed={100}
                        style={style.aiCoachResponseText}
                        onComplete={() => setShowQuote(true)}
                    />

                    {showQuote && (

                        <View style={style.quoteContainer}>

                            <TypewriterText
                                text={quote}
                                speed={70}
                                style={style.quoteText}
                                onComplete={() => {
                                    setShowAuthor(true);
                                    setShowRefresh(true);
                                }}
                                refreshKey={refreshKey}
                            />

                            {showAuthor && (
                                <Text style={style.quoteWriter}>
                                    {author}
                                </Text>
                            )}

                        </View>

                    )}

                </View>

                {/* Refresh */}

                {showRefresh && (

                    <View style={style.refreshContainer}>

                        <Text style={style.refreshTitle}>
                            Refresh daily with your latest stats
                        </Text>

                        <TouchableOpacity
                            style={style.refreshBtn}
                            activeOpacity={0.7}
                            onPress={handleRefresh}
                        >
                            <Ionicons
                                name="refresh"
                                style={style.refreshIcon}
                            />

                            <Text style={style.totalDayText}>
                                Refresh
                            </Text>

                        </TouchableOpacity>

                    </View>

                )}

            </View>

        </View>
    );
};

export default AICoach;