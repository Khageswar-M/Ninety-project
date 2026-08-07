package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.LoginRequest;
import Ninety.com.backend.dto.request.RegisterRequest;
import Ninety.com.backend.dto.response.LoginResponse;

public interface AuthService {
    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
