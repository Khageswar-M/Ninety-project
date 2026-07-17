import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons, Octicons, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { useSettingStyles } from '../../hook/useThemeStyles'
import ConfirmationModal from '../modals/ConfirmationModal';
import { useState } from 'react';

const Challenge = () => {
    const style = useSettingStyles();

    const [deleteConformationModal, setDeleteConfirmationModal] = useState(false);

    const handleReset = () => {
        try{
            console.log("Data Deleted!");
        }finally{
            setDeleteConfirmationModal(false);
        }
    }
    return (
        <View>
            <Text style={style.componentTitle}>Challenge</Text>

            {/* Challenge container */}
            <View style={style.challengeContainer}>

                {/* Heading */}
                <View style={style.challengeHeadingContainer}>
                    {/* ICON */}
                    <View style={style.challengeHeadingIconContainer}>
                        <Octicons name='flame' style={style.challengeHeadingIcon} />
                    </View>

                    {/* Title */}
                    <View style={style.challengeTitleContainer}>
                        <Text style={style.challengeTitle}>
                            Overall-progress
                        </Text>
                        <Text style={style.challengeDesc}>
                            23 days in - 67 remaining
                        </Text>
                    </View>
                </View>

                {/* Progress bar container */}
                <View style={style.progressBarContainer}>
                    {/* Day between */}
                    <View style={style.progressBarTitlesContainer}>
                        <Text style={style.progressBarTitle}>Day 1</Text>
                        <Text style={style.progressBarTitle}>Day 90</Text>
                    </View>

                    {/* Progress bar */}
                    <View style={style.progressBar} >

                        {/* BAR */}
                        <View style={{
                            height: '100%',
                            width: '70%',
                            backgroundColor: '#ff7300',
                            borderRadius: 10
                        }} />
                    </View>

                    {/* Remaining Days */}
                    <View style={style.progressBarRemainingTitles}>
                        <Text style={style.progressBarRemainingTitleLeft}>
                            Started Jun 5, 2026
                        </Text>

                        <Text style={[style.progressBarRemainingTitleLeft, style.progressBarRemainingTitleRight]}>
                            100% done
                        </Text>
                    </View>
                </View>

                {/* Reset Challenge */}
                <View style={style.resetChallengeWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={style.resetChallengeContainer}
                        onPress={() => setDeleteConfirmationModal(true)}
                    >

                        <View style={style.resetChallengeBoard}>
                            {/* ICON */}
                            <View style={style.challengeHeadingIconContainer}>
                                <EvilIcons name='refresh' style={style.resetIcon} />
                            </View>

                            {/* Title */}
                            <View style={style.challengeTitleContainer}>
                                <Text style={style.challengeTitle}>
                                    Reset challenge
                                </Text>
                                <Text style={style.challengeDesc}>
                                    Clears all checked days
                                </Text>
                            </View>

                        </View>

                        <Ionicons name='chevron-forward' style={style.chevronIconRight} />

                    </TouchableOpacity>
                </View>
            </View>

            <ConfirmationModal
                isVisible={deleteConformationModal}
                onCancel={() => setDeleteConfirmationModal(false)}
                onAction={handleReset}
                title={"Alert"}
                message={"Clearing all data will be permanently delete your information. This action cannot be undone."}
                cancelBtnTitle={"No"}
                actionBtnTitle={"Clear"}
            />
        </View>
    )
}

export default Challenge