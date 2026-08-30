package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SettingsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SettingsServiceImpl settingsService;

    @Test
    void shouldGetCorrectLoggedInUserEmail() {

        // Arrange
        Authentication authentication = mock(Authentication.class);

        when(authentication.getName())
                .thenReturn("khageswarmaharana462@gmail.com");

        SecurityContext securityContext =
                mock(SecurityContext.class);

        when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);

        // Act
        settingsService.getSettings();

        // Assert
        verify(authentication).getName();
    }
}