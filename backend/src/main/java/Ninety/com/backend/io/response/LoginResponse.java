package Ninety.com.backend.io.response;

import lombok.Builder;

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
