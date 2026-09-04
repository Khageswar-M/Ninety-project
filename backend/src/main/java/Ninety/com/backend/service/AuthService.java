package Ninety.com.backend.service;

import Ninety.com.backend.io.request.LoginRequest;
import Ninety.com.backend.io.request.RegisterRequest;
import Ninety.com.backend.io.request.UpdatePasswordRequest;
import Ninety.com.backend.io.response.LoginResponse;

public interface AuthService {
    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void logout();

    boolean existsByEmail(String email);

    void updatePassword(UpdatePasswordRequest request);


}
