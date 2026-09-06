package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.io.response.ChallengeResponse;
import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.ChallengeNotFoundException;
import Ninety.com.backend.exception.UserNotFoundException;
import Ninety.com.backend.io.response.ChallengesResponse;
import Ninety.com.backend.repository.ChallengeRepository;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    @Override
    public ChallengeResponse createChallenge() {

        User loggedUser = getLoggedUser();

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(90);

        DateTimeFormatter titleFormatter = DateTimeFormatter.ofPattern("d MMM");
        String title = String.format("Sprint (%s - %s)",
                startDate.format(titleFormatter),
                endDate.format(titleFormatter));


        Challenge newChallenge = Challenge.builder()
                .user(loggedUser)
                .title(title)
                .startedAt(LocalDate.now())
                .createdAt(LocalDate.now())
                .updatedAt(LocalDateTime.now())
                .build();

        challengeRepository.save(newChallenge);

        return ChallengeResponse.builder()
                .id(newChallenge.getId())
                .title(newChallenge.getTitle())
                .dayGrid(newChallenge.getDayGrid())
                .currentDay(newChallenge.getCurrentDay())
                .createdAt(newChallenge.getCreatedAt())
                .updatedAt(newChallenge.getUpdatedAt())
                .completed(newChallenge.isCompleted())
                .build();
    }

    @Override
    public List<ChallengesResponse> getChallengesByUserId(Long userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Challenge> userChallenges = existingUser.getChallenges();

        // Newest challenge first
        userChallenges.sort(
                Comparator
                        .comparing(Challenge::isCompleted)
                        .thenComparing(
                                Challenge::getCreatedAt,
                                Comparator.reverseOrder()
                        )
        );

        Challenge currentChallenge = userChallenges.get(0);

        LocalDate createdOn = currentChallenge.getCreatedAt();
        LocalDate today = LocalDate.now();

        int daysPassed = (int)ChronoUnit.DAYS.between(createdOn, today) + 1;

        if(currentChallenge.getCurrentDay() != daysPassed){
            currentChallenge.setCurrentDay(daysPassed);

            challengeRepository.save(currentChallenge);
        }



        return userChallenges.stream()
                .map(challenge -> ChallengesResponse.builder()
                        .id(challenge.getId())
                        .title(challenge.getTitle())
                        .dayGrid(challenge.getDayGrid())
                        .currentDay(challenge.getCurrentDay())
                        .longestStreak(challenge.getLongestStreak())
                        .completedCount(challenge.getCompletedCount())
                        .missedCount(challenge.getMissedCount())
                        .createdAt(challenge.getCreatedAt())
                        .updatedAt(challenge.getUpdatedAt())
                        .completed(challenge.isCompleted())
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
        challenge.setStreakCount(currentStreak);
        challenge.setMissedCount(missedDayCount);

        challengeRepository.save(challenge);
    }

    private Challenge existingChallenge(Long challengeId){

        Challenge existedChallenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge not found."));

        return existedChallenge;
    }

    private User getLoggedUser(){
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User loggedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return loggedUser;
    }
}
