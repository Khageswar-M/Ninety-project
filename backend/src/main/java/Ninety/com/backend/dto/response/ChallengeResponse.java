package Ninety.com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeResponse {

    private Long id;
    private String title;
    private boolean[][] dayGrid;
    private int currentDay;
    private int currentStreak;
    private int longestStreak;
    private int streakCount;
    private int completedCount;
    private LocalDate startDate;
    private boolean completed;

}
