package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.LoginRequest;
import Ninety.com.backend.dto.request.RegisterRequest;
import Ninety.com.backend.dto.request.UpdatePasswordRequest;
import Ninety.com.backend.dto.request.UserExistsRequest;
import Ninety.com.backend.dto.response.LoginResponse;

public interface AuthService {
    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void logout();

    boolean existsByEmail(String email);

    void updatePassword(UpdatePasswordRequest request);

    void updateFullName(String newName);

}
