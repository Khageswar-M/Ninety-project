package Ninety.com.backend.repository;

import Ninety.com.backend.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettingsRepository extends JpaRepository<Settings, Long> {

    List<Settings> findByDailyReminderTrueAndExpoPushTokenIsNotNull();

}
