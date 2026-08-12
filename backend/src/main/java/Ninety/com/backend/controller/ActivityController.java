package Ninety.com.backend.controller;

import Ninety.com.backend.dto.request.CreateActivityRequest;
import Ninety.com.backend.dto.response.ActivityResponse;
import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/activity")
@RequiredArgsConstructor
@Tag(name = "Activity", description = "Use to control activity entity.")
public class ActivityController {


    private final ActivityService activityService;

    @PostMapping("/create-activity")
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
}
