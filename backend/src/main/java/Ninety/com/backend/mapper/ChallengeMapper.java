package Ninety.com.backend.mapper;

import Ninety.com.backend.dto.response.ChallengeResponse;
import Ninety.com.backend.entity.Challenge;

public class ChallengeMapper {

    public ChallengeResponse toResponse(Challenge challenge){
        return ChallengeResponse.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .dayGrid(challenge.getDayGrid())
                .currentDay(challenge.getCurrentDay())
                .currentStreak(challenge.getCurrentStreak())
                .longestStreak(challenge.getLongestStreak())
                .streakCount(challenge.getStreakCount())
                .completedCount(challenge.getCompletedCount())
                .startDate(challenge.getStartDate())
                .completed(challenge.isCompleted())
                .build();
    }
}
