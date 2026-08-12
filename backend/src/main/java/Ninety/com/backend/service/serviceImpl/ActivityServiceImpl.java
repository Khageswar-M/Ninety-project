package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.request.ActivityUpdateRequest;
import Ninety.com.backend.dto.request.CreateActivityRequest;
import Ninety.com.backend.dto.response.ActivityResponse;
import Ninety.com.backend.entity.Activity;
import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.exception.ActivityNotFoundException;
import Ninety.com.backend.exception.ChallengeNotFoundException;
import Ninety.com.backend.repository.ActivityRepository;
import Ninety.com.backend.repository.ChallengeRepository;
import Ninety.com.backend.service.ActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {


    private final ChallengeRepository challengeRepository;
    private final ActivityRepository activityRepository;
    private final RedisTemplate<String, Object> redisTemplate;


    @Override
    public ActivityResponse createActivity(CreateActivityRequest request) {

        Challenge existingChallenge = challengeRepository.findById(request.challengeId())
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge not found."));

        Activity newActivity = Activity.builder()
                .challenge(existingChallenge)
                .dayNumber(existingChallenge.getCurrentDay())
                .title(request.title())
                .build();


        activityRepository.save(newActivity);

        ActivityResponse response = ActivityResponse.builder()
                .id(newActivity.getId())
                .dayNumber(newActivity.getDayNumber())
                .title(newActivity.getTitle())
                .createdAt(newActivity.getCreatedAt())
                .updatedAt(newActivity.getUpdatedAt())
                .build();

        String redisKey =
                "activities:challenge:"
                        + request.challengeId()
                        + ":day:"
                        + existingChallenge.getCurrentDay();

        List<ActivityResponse> cachedActivities =
                (List<ActivityResponse>) redisTemplate.opsForValue()
                        .get(redisKey);

        if (cachedActivities != null) {

            cachedActivities = new ArrayList<>(cachedActivities);

            cachedActivities.add(response);

            redisTemplate.opsForValue()
                    .set(redisKey, cachedActivities);
        }

        return response;
    }

    @Override
    public void deleteActivity(Long activityId) {
        Activity activity = findActivity(activityId);

        activityRepository.delete(activity);
    }

    @Override
    public void updateActivity(ActivityUpdateRequest request) {
        Activity activity = findActivity(request.activityId());

        activity.setTitle(request.newTitle());

        activityRepository.save(activity);
    }

    @Override
    public List<ActivityResponse> getAllActivitiesByDay(Long challengeId, int dayNumber) {

        String redisKey = "activities:challenge:" + challengeId + ":day:" + dayNumber;

        List<ActivityResponse> cachedActivities =
                (List<ActivityResponse>) redisTemplate.opsForValue()
                        .get(redisKey);

        if(cachedActivities != null){
            return cachedActivities;
        }

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException("Challenge not found."));



        List<ActivityResponse> responses = challenge.getActivities()
                .stream()
                .filter(activity -> activity.getDayNumber() == dayNumber)
                .map(activity -> ActivityResponse.builder()
                        .id(activity.getId())
                        .dayNumber(activity.getDayNumber())
                        .title(activity.getTitle())
                        .createdAt(activity.getCreatedAt())
                        .updatedAt(activity.getUpdatedAt())
                        .build()
                ).toList();

        redisTemplate.opsForValue()
                .set(redisKey, responses);

        return responses;
    }


    private Activity findActivity(Long id){
        Activity existingActivity = activityRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException("Activity not found"));

        return existingActivity;
    }
}
