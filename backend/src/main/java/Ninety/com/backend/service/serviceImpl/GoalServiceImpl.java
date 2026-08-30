package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.response.GoalResponse;
import Ninety.com.backend.entity.Goal;
import Ninety.com.backend.entity.GoalStatus;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.GoalNotFoundException;
import Ninety.com.backend.exception.UserNotFoundException;
import Ninety.com.backend.repository.GoalRepository;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.GoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public GoalResponse createGoal(String title) {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        Goal goal = Goal.builder()
                .title(title.trim())
                .user(user)
                .build();

        Goal savedGoal = goalRepository.save(goal);

        return mappedToResponse(savedGoal);
    }

    @Override
    public GoalResponse updateGoal(long goalId, String newTitle) {
        Goal existingGoal = goalRepository.findById(goalId)
                .orElseThrow(() -> new GoalNotFoundException("Goal not found."));

        String oldTitle = existingGoal.getTitle();
        if(oldTitle.equals(newTitle)){
            return mappedToResponse(existingGoal);
        }

        existingGoal.setTitle(newTitle);

        Goal updatedGoal = goalRepository.save(existingGoal);

        return mappedToResponse(updatedGoal);
    }

    @Override
    public void deleteGoal(long goalId) {
        Goal existingGoal = goalRepository.findById(goalId)
                .orElseThrow(() -> new GoalNotFoundException("Goal not found."));

        goalRepository.deleteById(goalId);
    }

    @Override
    public List<GoalResponse> getAllGoals(long userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        List<GoalResponse> goals = existingUser.getGoals()
                .stream()
                .map(this::mappedToResponse)
                .toList();

        return goals;
    }

    @Override
    public GoalResponse updateStatus(long goalId, GoalStatus status) {
        Goal existingGoal = goalRepository.findById(goalId)
                .orElseThrow(() -> new GoalNotFoundException("Goal not found."));

        existingGoal.setStatus(status);

        Goal updatedGoal = goalRepository.save(existingGoal);

        return mappedToResponse(updatedGoal);
    }

    private GoalResponse mappedToResponse(Goal goal){
        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .status(goal.getStatus().toString())
                .createdAt(goal.getCreatedAt().toString())
                .updatedAt(goal.getUpdatedAt().toString())
                .build();
    }
}
