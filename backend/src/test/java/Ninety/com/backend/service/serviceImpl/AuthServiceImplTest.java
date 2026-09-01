package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.io.request.LoginRequest;
import Ninety.com.backend.io.request.RegisterRequest;
import Ninety.com.backend.io.response.LoginResponse;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.EmailAlreadyExistsException;
import Ninety.com.backend.exception.InvalidCredentialsException;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.EmailService;
import Ninety.com.backend.utils.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void checkRegister(){
        RegisterRequest request = new RegisterRequest(
                "abc@gmail.com",
                "Khageswar",
                "123456"
        );

        when(userRepository.existsByEmail(request.email()))
                .thenReturn(false);

        when(passwordEncoder.encode(request.password()))
                .thenReturn("encodedPassword");

        authService.register(request);

        verify(userRepository).existsByEmail("abc@gmail.com");
        verify(passwordEncoder).encode("123456");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        User savedUser = captor.getValue();

        assertEquals("abc@gmail.com", savedUser.getEmail());
        assertEquals("Khageswar", savedUser.getFullName());
        assertEquals("encodedPassword", savedUser.getPassword());
    }

    @Test
    void registerWithDuplicateEmail(){

        RegisterRequest request = new RegisterRequest(
                "abc@gmail.com",
                "Khageswar",
                "123456"
        );

        when(userRepository.existsByEmail(request.email()))
                .thenReturn(true);

        EmailAlreadyExistsException exception = assertThrows(
                EmailAlreadyExistsException.class,
                () -> authService.register(request)
        );

        assertEquals("An account with this email already exists.", exception.getMessage());

        verify(userRepository).existsByEmail(request.email());

        verify(passwordEncoder, never())
                .encode(anyString());

        verify(userRepository, never())
                .save(any(User.class));
    }

    @Test
    void loginSuccess(){
        LoginRequest request = new LoginRequest(
                "abc@gmail.com",
                "password"
        );

        User user = User.builder()
                .id(1L)
                .fullName("Khageswar")
                .email("abc@gmail.com")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(user));

        when(jwtUtil.generateToken(request.email()))
                .thenReturn("jwt-token");

        LoginResponse response = authService.login(request);
        System.out.println(response);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Khageswar", response.fullName());
        assertEquals("abc@gmail.com", response.email());
        assertEquals("jwt-token", response.jwtToken());
        assertTrue(response.isEnabled());

        verify(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        verify(userRepository)
                .findByEmail(request.email());

        verify(jwtUtil)
                .generateToken(request.email());

        verify(emailService)
                .sendWelcomeEmail("abc@gmail.com", "Khageswar");
    }

    @Test
    void login_shouldThrowException_WhenAuthenticationFails(){
        // Arrange
        LoginRequest request = new LoginRequest(
                "abc@gmail.com",
                "wrongPassword"
        );

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        InvalidCredentialsException exception = assertThrows(
                InvalidCredentialsException.class,
                () -> authService.login(request)
        );

        assertEquals("Invalid email or password.", exception.getMessage());

        verify(authenticationManager)
                .authenticate(any(Authentication.class));

        verify(userRepository, never())
                .findByEmail(anyString());


        verify(jwtUtil, never())
                .generateToken(anyString());

        verify(emailService, never())
                .sendWelcomeEmail(anyString(), anyString());
    }

    @Test
    void login_shouldThrowException_WhenUserNotFound(){

        LoginRequest request = new LoginRequest(
                "abc@gmail.com",
                "password"
        );

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenReturn(authentication);

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.empty());

        InvalidCredentialsException exception = assertThrows(
                InvalidCredentialsException.class,
                () -> authService.login(request)
        );

        assertEquals("Invalid email or password.", exception.getMessage());

        verify(authenticationManager)
                .authenticate(any(Authentication.class));

        verify(userRepository)
                .findByEmail(request.email());

        verify(jwtUtil, never())
                .generateToken(anyString());

        verify(emailService, never())
                .sendWelcomeEmail(anyString(), anyString());

    }

    @Test
    void login_shouldGenerateJwtToken(){
        LoginRequest request = new LoginRequest(
                "abc@gmail.com",
                "password"
        );

        User user = User.builder()
                .id(1L)
                .fullName("Khageswar")
                .email("abc@gmail.com")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();


        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenReturn(authentication);

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(user));

        when(jwtUtil.generateToken(request.email()))
                .thenReturn("jwt_token");

        authService.login(request);
        verify(jwtUtil).generateToken(request.email());
    }

    @Test
    void login_shouldSendWelcomeEmail(){
        LoginRequest request = new LoginRequest(
                "abc@gmail.com",
                "password"
        );

        User user = User.builder()
                .id(1L)
                .fullName("Khageswar")
                .email("abc@gmail.com")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenReturn(authentication);

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(user));

        when(jwtUtil.generateToken(request.email()))
                .thenReturn("jwt_token");

        authService.login(request);

        verify(emailService)
                .sendWelcomeEmail(
                        "abc@gmail.com",
                        "Khageswar"
                );
    }
}