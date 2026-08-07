package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.request.LoginRequest;
import Ninety.com.backend.dto.request.RegisterRequest;
import Ninety.com.backend.dto.response.LoginResponse;
import Ninety.com.backend.entity.Role;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.EmailAlreadyExistsException;
import Ninety.com.backend.exception.InvalidCredentialsException;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.AuthService;
import Ninety.com.backend.service.EmailService;
import Ninety.com.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.email())){
            throw new EmailAlreadyExistsException("An account with this email already exists.");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .emailVerified(true)
                .enabled(true)
                .build();

        userRepository.save(user);
        log.info("Registered new user {}", user.getEmail());

    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {

        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        String jwtToken = jwtUtil.generateToken(request.email());

        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());

        return LoginResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .isEnabled(user.isEnabled())
                .createdAt(user.getCreatedAt().toString())
                .updatedAt(user.getUpdatedAt().toString())
                .jwtToken(jwtToken)
                .build();
    }
}
