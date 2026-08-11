package Ninety.com.backend.controller;

import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.dto.response.ChallengeResponse;
import Ninety.com.backend.service.ChallengeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/challenge")
@RequiredArgsConstructor
@Tag(name = "ChallengeController", description = "Use to control Challenge entity operations.")
public class ChallengeController {

    private final ChallengeService challengeService;

    @PostMapping("/create-challenge/{userId}")
    public ResponseEntity<ApiResponse> createChallenge(
            @PathVariable
            Long userId
    ){
        ChallengeResponse response = challengeService.createChallenge(userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("A new challenge board was created successfully.", response));
    }


}
