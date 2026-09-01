package Ninety.com.backend.repository;

import Ninety.com.backend.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByChallenge_IdAndDayNumberLessThanEqualOrderByDayNumberAsc(
            Long challengeId,
            int dayNumber
    );
}
