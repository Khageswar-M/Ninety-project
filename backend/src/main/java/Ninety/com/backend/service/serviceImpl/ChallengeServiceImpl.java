package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.response.ActivityResponse;
import Ninety.com.backend.dto.response.ChallengeResponse;
import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.ChallengeNotFoundException;
import Ninety.com.backend.exception.UserNotFoundException;
import Ninety.com.backend.repository.ChallengeRepository;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    @Override
    public ChallengeResponse createChallenge(Long userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        Challenge newChallenge = Challenge.builder()
                .user(existingUser)
                .title("Your new 90 Day's challenge.")
                .startedAt(LocalDate.now())
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .build();

        challengeRepository.save(newChallenge);

        return ChallengeResponse.builder()
                .id(newChallenge.getId())
                .title(newChallenge.getTitle())
                .dayGrid(newChallenge.getDayGrid())
                .currentDay(newChallenge.getCurrentDay())
                .currentStreak(newChallenge.getCurrentStreak())
                .longestStreak(newChallenge.getLongestStreak())
                .streakCount(newChallenge.getStreakCount())
                .completedCount(newChallenge.getCompletedCount())
                .startedAt(newChallenge.getStartedAt())
                .completed(newChallenge.isCompleted())
                .createdAt(newChallenge.getCreatedAt())
                .updatedAt(newChallenge.getUpdatedAt())
                .activities(null)
                .build();
    }

    @Override
    public List<ChallengeResponse> getChallengesByUserId(Long userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        List<Challenge> userChallenges = existingUser.getChallenges();

        return userChallenges.stream()
                .map(challenge -> ChallengeResponse.builder()
                        .id(challenge.getId())
                        .title(challenge.getTitle())
                        .dayGrid(challenge.getDayGrid())
                        .currentDay(challenge.getCurrentDay())
                        .currentStreak(challenge.getCurrentStreak())
                        .longestStreak(challenge.getLongestStreak())
                        .streakCount(challenge.getStreakCount())
                        .missedCount(challenge.getMissedCount())
                        .completed(challenge.isCompleted())
                        .createdAt(challenge.getCreatedAt())
                        .updatedAt(challenge.getUpdatedAt())
                        .activities(
                                challenge.getActivities()
                                    .stream()
                                        .map(activity -> ActivityResponse.builder()
                                                .id(activity.getId())
                                                .dayNumber(activity.getDayNumber())
                                                .title(activity.getTitle())
                                                .createdAt(activity.getCreatedAt())
                                                .updatedAt(activity.getUpdatedAt())
                                                .build()
                                        ).toList()
                        )
                        .build()
                ).toList();
    }

    @Override
    public void deleteChallenge(Long challengeId) {

        Challenge challenge = existingChallenge(challengeId);

        challengeRepository.deleteById(challenge.getId());
    }

    @Override
    public int getMyCurrentStreakDay(Long challengeId) {

        Challenge challenge = existingChallenge(challengeId);

        int myCurrentStreakDay = (int) ChronoUnit.DAYS.between(
                challenge.getCreatedAt(),
                LocalDate.now()
        ) + 1;

        if(myCurrentStreakDay >= 91){
            challenge.setCompleted(true);
            challengeRepository.save(challenge);
        }

        return myCurrentStreakDay;
    }

    @Override
    public void computeStreakCounts(Long challengeId) {

        Challenge challenge = existingChallenge(challengeId);

        boolean[][] grid = challenge.getDayGrid();
        int currentDay = getMyCurrentStreakDay(challenge.getId());

        int maxStreak = 0;
        int currentStreak = 0;
        int missedDayCount = 0;

        for(int day = 1; day < currentDay; day++){

            int row = (day - 1) / 10;
            int col = (day - 1) % 10;

            if(grid[row][col]){

                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);

            }else{

                missedDayCount++;
                currentStreak = 0;

            }
        }

        challenge.setLongestStreak(maxStreak);
        challenge.setCurrentStreak(currentStreak);
        challenge.setMissedCount(missedDayCount);

        challengeRepository.save(challenge);
    }

    private Challenge existingChallenge(Long challengeId){

        Challenge existedChallenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge not found."));

        return existedChallenge;
    }
}
