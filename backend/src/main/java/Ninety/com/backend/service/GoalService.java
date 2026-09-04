package Ninety.com.backend.service;


import Ninety.com.backend.io.response.GoalResponse;
import Ninety.com.backend.entity.GoalStatus;

import java.util.List;

public interface GoalService {

    GoalResponse createGoal(String title);

    GoalResponse updateGoal(long goalId, String newTitle);

    void deleteGoal(long goalId);

    List<GoalResponse> getAllGoals(long userId);

    GoalResponse updateStatus(long goalId, GoalStatus status);
}
