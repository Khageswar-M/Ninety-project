package Ninety.com.backend.mapper;

import Ninety.com.backend.dto.response.UserResponse;
import Ninety.com.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper{

    public UserResponse toResponse(User user){
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

}
