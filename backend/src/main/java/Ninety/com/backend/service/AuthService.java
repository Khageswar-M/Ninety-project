package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
}
