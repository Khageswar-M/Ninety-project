package Ninety.com.backend.controller;

import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.dto.response.ChallengeResponse;
import Ninety.com.backend.service.ChallengeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


    @PostMapping("/delete-challenge/{challengeId}")
    public ResponseEntity<ApiResponse> deleteChallenge(
            @PathVariable
            Long challengeId
    ){
        challengeService.deleteChallenge(challengeId);

        return ResponseEntity.ok(ApiResponse.success("Challenge deleted successfully."));
    }

    @GetMapping("/challenges-by-userId/{userId}")
    public ResponseEntity<ApiResponse> challengesByUserId(
            @PathVariable
            Long userId
    ){
        List<ChallengeResponse> response = challengeService.getChallengesByUserId(userId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "There are the challenges.",
                                response
                        )
                );
    }


}
