package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.components.ChallengeAiDataBuilder;
import Ninety.com.backend.dto.ChallengeAiPayload;
import Ninety.com.backend.entity.Activity;
import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.entity.Goal;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.ChallengeNotFoundException;
import Ninety.com.backend.exception.UserNotFoundException;
import Ninety.com.backend.io.response.AiInsightResponse;
import Ninety.com.backend.prompt.MotivationPromptBuilder;
import Ninety.com.backend.repository.ActivityRepository;
import Ninety.com.backend.repository.ChallengeRepository;
import Ninety.com.backend.repository.GoalRepository;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.AiInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiInsightServiceImpl implements AiInsightService {

    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final GoalRepository goalRepository;
    private final ActivityRepository activityRepository;

    private final ChallengeAiDataBuilder dataBuilder;
    private final MotivationPromptBuilder promptBuilder;
    private final ChatClient chatClient;



    @Override
    public AiInsightResponse getChallengeInsight() {

        User loggedinUser = findLoggedinUser();

        Challenge challenge = challengeRepository
                .findByUserAndCompletedFalse(loggedinUser)
                .orElseThrow(() -> new ChallengeNotFoundException("Active Challenge not found."));

        List<Activity> activities = activityRepository
                .findByChallenge_IdAndDayNumberLessThanEqualOrderByDayNumberAsc(
                        challenge.getId(),
                        challenge.getCurrentDay()
                );

        List<Goal> goals = goalRepository.findByUser(loggedinUser);

        ChallengeAiPayload payload =
                dataBuilder.build(
                        challenge,
                        activities,
                        goals
                );

        Prompt prompt = promptBuilder.build(payload);

        String aiMessage =
                chatClient
                        .prompt(prompt)
                        .call()
                        .content();

        return AiInsightResponse.builder()
                .data(payload)
                .aiMessage(aiMessage)
                .build();
    }

    private User findLoggedinUser(){
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User loggedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        return loggedUser;
    }
}
