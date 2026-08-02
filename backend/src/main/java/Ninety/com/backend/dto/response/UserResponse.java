package Ninety.com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse{
    private Long id;
    private String fullName;
    private String email;
    private boolean emailVerified;
    private LocalDateTime createdAt;
}
