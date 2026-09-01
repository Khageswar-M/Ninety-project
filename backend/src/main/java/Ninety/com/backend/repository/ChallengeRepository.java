package Ninety.com.backend.repository;

import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    Optional<Challenge> findByUser(User user);

    Optional<Challenge> findByUserAndCompletedFalse(User user);
}
