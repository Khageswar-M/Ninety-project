package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.request.RegisterRequest;
import Ninety.com.backend.entity.Role;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.EmailAlreadyExistsException;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.security.JwtService;
import Ninety.com.backend.service.AuthService;
import Ninety.com.backend.service.EmailService;
import Ninety.com.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("An account with this email is already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.USER)
                .emailVerified(false)
                .enabled(true)
                .build();

        userRepository.save(user);

        log.info("Registered new user {}", user.getEmail());
    }
}
