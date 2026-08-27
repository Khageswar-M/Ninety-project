package Ninety.com.backend.controller;

import Ninety.com.backend.dto.request.ActivityUpdateRequest;
import Ninety.com.backend.dto.request.CreateActivityRequest;
import Ninety.com.backend.dto.response.ActivityResponse;
import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/v1/activity")
@RequiredArgsConstructor
@Tag(name = "Activity", description = "Use to control activity entity.")
public class ActivityController {


    private final ActivityService activityService;

    @GetMapping("/{challengeId}/days/{dayNumber}")
    @Operation(summary = "Get all stored activities of the requested day.")
    public ResponseEntity<ApiResponse> getAllActivity(
            @PathVariable Long challengeId,
            @PathVariable int dayNumber
    ){
        List<ActivityResponse> allActivities = activityService.getAllActivitiesByDay(challengeId, dayNumber);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Activities found successfully.",
                            allActivities
                )
        );
    }

    @PostMapping("/create")
    @Operation(summary = "Help's to create a new activity for the current streak.")
    public ResponseEntity<ApiResponse> createActivity(
            @Valid
            @RequestBody
            CreateActivityRequest request
    ){
        ActivityResponse response = activityService.createActivity(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "New activity created successfully.",
                                response
                        )
                );
    }

    @DeleteMapping("/delete/{activityId}")
    @Operation(summary = "Use to delete the respective activity by id.")
    public ResponseEntity<ApiResponse> deleteActivity(
            @PathVariable
            Long activityId
    ){
        activityService.deleteActivity(activityId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Activity deleted successfully.",
                        null
                )
        );
    }

    @PatchMapping("/update")
    @Operation(summary = "Use to update the respective activity by id.")
    public ResponseEntity<ApiResponse> updateActivity(
            @Valid
            @RequestBody
            ActivityUpdateRequest request
    ){

        log.info("/update enter.");
        ActivityResponse response = activityService.updateActivity(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Updated successfully.",
                        response
                )
        );
    }

    @GetMapping("/activities")
    @Operation(summary = "Use to get all the activities by the dayNumber.")
    public ResponseEntity<ApiResponse> activitiesByDayNumber(
            @RequestParam
            Long challengeId,

            @RequestParam
            int dayNumber
    ){
        List<ActivityResponse> responses =
                activityService.getAllActivitiesByDay(challengeId, dayNumber);

        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "Filtered activities.",
                                responses
                        )
                );
    }
}
