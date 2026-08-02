package Ninety.com.backend.service;

import Ninety.com.backend.dto.response.UserResponse;

public interface UserService{

    UserResponse getCurrentUser (Long userId);
}
