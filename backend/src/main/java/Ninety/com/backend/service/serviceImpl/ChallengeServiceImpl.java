package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.response.ChallengeResponse;
import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.UserNotFoundException;
import Ninety.com.backend.repository.ChallengeRepository;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

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
}
