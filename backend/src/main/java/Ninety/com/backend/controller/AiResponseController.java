package Ninety.com.backend.controller;

import Ninety.com.backend.io.response.AiInsightResponse;
import Ninety.com.backend.io.response.ApiResponse;
import Ninety.com.backend.service.AiInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai-coach")
@RequiredArgsConstructor
public class AiResponseController {

    private final AiInsightService aiInsightService;

    @GetMapping
    public ResponseEntity<ApiResponse> aiResponse(){
        AiInsightResponse response = aiInsightService.getChallengeInsight();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Gemini response",
                        response
                )
        );
    }

}
