package Ninety.com.backend.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;

class UserTest {

    private User user;
    private Challenge challenge;
    private Activity activity;

    @BeforeEach
    void setUp(){
        user = new User();
        challenge = new Challenge();
        activity = new Activity();
    }

    @Test
    void shouldCreateUserWithChallengeAndActivity() throws JsonProcessingException {
        user.setId(1L);
        user.setFullName("Khageswar Maharana");
        user.setEmail("khageswarmaharaan462@gmail.com");
        user.setPassword("maharana");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        challenge.setId(100L);
        challenge.setUser(user);
        challenge.setTitle("90 Day's DSA");
        challenge.setCurrentDay(1);
        challenge.setLongestStreak(5);
        challenge.setStreakCount(1);
        challenge.setCompletedCount(5);
        challenge.setStartedAt(LocalDate.now());
        challenge.setCompleted(false);
        challenge.setActivities(new ArrayList<>());
        challenge.setCreatedAt(LocalDate.now());
        challenge.setUpdatedAt(LocalDate.now());
        boolean[][] dayGrid = challenge.getDayGrid();
        dayGrid[0][0] = true;

        activity.setId(100L);
        activity.setChallenge(challenge);
        activity.setDayNumber(1);
        activity.setTitle("DSA");
        activity.setCreatedAt(LocalDateTime.now());
        activity.setUpdatedAt(LocalDateTime.now());


        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

        String json = objectMapper.writeValueAsString(activity);
        System.out.println(json);
        for (boolean[] row: dayGrid) {
            System.out.println(Arrays.toString(row));
        }
    }

}