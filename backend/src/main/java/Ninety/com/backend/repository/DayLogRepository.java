package Ninety.com.backend.repository;

import Ninety.com.backend.entity.DayLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DayLogRepository extends JpaRepository<DayLog, Long> {
}
