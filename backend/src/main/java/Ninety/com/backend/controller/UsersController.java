package Ninety.com.backend.controller;

import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.serviceImpl.AuthServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "UserController", description = "Control users exists with credentials.")
public class UsersController {

    private final AuthServiceImpl authService;

    @GetMapping("/exists")
    public ResponseEntity<ApiResponse> checkUserExists(@RequestParam String email){
        boolean exists = authService.existsByEmail(email);

        return ResponseEntity.ok(
                ApiResponse.success(
                        exists
                            ? "User exists"
                                : "User does not exits",
                        exists

                )
        );
    }

}
