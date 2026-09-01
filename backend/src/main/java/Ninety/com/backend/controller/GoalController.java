package Ninety.com.backend.controller;

import Ninety.com.backend.io.response.ApiResponse;
import Ninety.com.backend.io.response.GoalResponse;
import Ninety.com.backend.entity.GoalStatus;
import Ninety.com.backend.service.GoalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/goal")
@RequiredArgsConstructor
@Tag(name = "Tag Controller", description = "Use to control Goal entity")
public class GoalController {

    private final GoalService goalService;

    @PostMapping("/create/{title}")
    public ResponseEntity<ApiResponse> createGoal(
            @PathVariable String title
    ){
        GoalResponse newGoal = goalService.createGoal(title);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "New goal created successfully.",
                                newGoal
                        )
                );
    }

    @PutMapping("/update/{goalId}/{newTitle}")
    public ResponseEntity<ApiResponse> updateGoal(
            @PathVariable long goalId,
            @PathVariable String newTitle
    ){
        GoalResponse updatedGoal = goalService.updateGoal(goalId, newTitle);

        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "Goal" + newTitle +"updated successfully",
                                updatedGoal
                        )
                );
    }

    @PutMapping("/update/status/{goalId}/{status}")
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable long goalId,
            @PathVariable GoalStatus status
    ){
        GoalResponse response = goalService.updateStatus(goalId, status);

        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "Status updated successfully.",
                                response
                        )
                );
    }

    @DeleteMapping("/delete/{goalId}")
    public ResponseEntity<ApiResponse> deleteGoal(
            @PathVariable long goalId
    ){
        goalService.deleteGoal(goalId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Goal deleted successfully"
                )
        );
    }

    @GetMapping("{userId}")
    public ResponseEntity<ApiResponse> getAllGoals(
            @PathVariable long userId
    ){
        List<GoalResponse> goals = goalService.getAllGoals(userId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "All goas fetched successfully.",
                                goals
                        )
                );
    }

}
