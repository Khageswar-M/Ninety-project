package Ninety.com.backend.repository;

import Ninety.com.backend.entity.Goal;
import Ninety.com.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);
}
