package Ninety.com.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeAiPayload {

    @JsonProperty("challenge")
    private boolean[][] challenge;

    @JsonProperty("activities")
    private List<DayActivitiesPayload> activities;

    @JsonProperty("goals")
    private List<GoalPayLoad> goals;

    @JsonProperty("user")
    private UserPayload user;

}
