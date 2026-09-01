package Ninety.com.backend.components;

import Ninety.com.backend.dto.ChallengeAiPayload;
import Ninety.com.backend.dto.DayActivitiesPayload;
import Ninety.com.backend.dto.GoalPayLoad;
import Ninety.com.backend.dto.UserPayload;
import Ninety.com.backend.entity.Activity;
import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.entity.Goal;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ChallengeAiDataBuilder {

    public ChallengeAiPayload build(
            Challenge challenge,
            List<Activity> activities,
            List<Goal> goals
    ){

        List<DayActivitiesPayload> activitiesPayloads =
                activities.stream()
                        .collect(Collectors.groupingBy(Activity::getDayNumber))
                        .entrySet().stream()
                        .sorted(Map.Entry.comparingByKey())
                        .map(e -> DayActivitiesPayload.builder()
                                .day(e.getKey())
                                .activities(e.getValue().stream()
                                        .map(Activity::getTitle)
                                        .collect(Collectors.toList()))
                                .build())
                        .collect(Collectors.toList());

        List<GoalPayLoad> goalPayLoad =
                goals.stream()
                        .map(g -> GoalPayLoad.builder()
                                .name(g.getTitle())
                                .status(g.getStatus().toString())
                                .build())
                        .collect(Collectors.toList());

        return ChallengeAiPayload.builder()
                .challenge(challenge.getDayGrid())
                .activities(activitiesPayloads)
                .goals(goalPayLoad)
                .user(UserPayload.builder()
                        .name(challenge.getUser().getFullName())
                        .build())
                .build();
    }
}
