package Ninety.com.backend.dto.response;

import lombok.Builder;

import java.util.List;

@Builder
public record LoginResponse(
        Long id,
        String fullName,
        String email,
        boolean isEnabled,
        String createdAt,
        String updatedAt,
        String jwtToken,
        boolean isLogin,
        Long expiresIn
) {
}
