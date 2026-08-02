package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.response.UserResponse;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.ResourceNotFoundException;
import Ninety.com.backend.mapper.UserMapper;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Cacheable(value = "users", key = "#userId")
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toResponse(user);
    }
}
