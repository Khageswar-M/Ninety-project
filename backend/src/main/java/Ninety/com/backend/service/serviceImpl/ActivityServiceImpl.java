package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.io.request.ActivityUpdateRequest;
import Ninety.com.backend.io.request.CreateActivityRequest;
import Ninety.com.backend.io.response.ActivityResponse;
import Ninety.com.backend.entity.Activity;
import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.exception.ActivityNotFoundException;
import Ninety.com.backend.exception.ChallengeNotFoundException;
import Ninety.com.backend.repository.ActivityRepository;
import Ninety.com.backend.repository.ChallengeRepository;
import Ninety.com.backend.service.ActivityService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ChallengeRepository challengeRepository;
    private final ActivityRepository activityRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;


    @Override
    @Transactional
    public ActivityResponse createActivity(
            CreateActivityRequest request) {

        log.info("createActivity service entered.");

        Challenge existingChallenge =
                challengeRepository.findById(request.challengeId())
                        .orElseThrow(() ->
                                new ChallengeNotFoundException(
                                        "Challenge not found."
                                )
                        );

        int currentDay =
                existingChallenge.getCurrentDay();

        if (currentDay < 1 || currentDay > 90) {
            throw new IllegalStateException(
                    "Challenge current day must be between 1 and 90"
            );
        }


        int row = (currentDay - 1) / 10;
        int col = (currentDay - 1) % 10;

        boolean[][] dayGrid =
                existingChallenge.getDayGrid();

        if (!dayGrid[row][col]) {

            dayGrid[row][col] = true;

            existingChallenge.setDayGrid(dayGrid);

            existingChallenge.setCompletedCount(
                    existingChallenge.getCompletedCount() + 1
            );
        }

        Activity newActivity = Activity.builder()
                .challenge(existingChallenge)
                .dayNumber(currentDay)
                .title(request.title())
                .build();

        activityRepository.saveAndFlush(newActivity);

        ActivityResponse response =
                buildActivityResponse(newActivity);

        String redisKey =
                buildRedisKey(
                        request.challengeId(),
                        currentDay
                );

        Object cachedData =
                redisTemplate.opsForValue()
                        .get(redisKey);

        if (cachedData != null) {

            log.info(
                    "Redis cache found while creating activity."
            );

            List<ActivityResponse> cachedActivities =
                    convertToActivityList(cachedData);

            cachedActivities =
                    new ArrayList<>(cachedActivities);

            cachedActivities.add(response);

            redisTemplate.opsForValue()
                    .set(
                            redisKey,
                            cachedActivities,
                            Duration.ofMinutes(5)
                    );

            log.info(
                    "New activity added to Redis cache. ID: {}",
                    response.id()
            );
        } else {

            log.info(
                    "Redis cache not found. Activity created only in database."
            );
        }

        return response;
    }


    @Override
    @Transactional
    public void deleteActivity(Long activityId) {

        log.info(
                "deleteActivity service entered. ID: {}",
                activityId
        );

        Activity activity =
                findActivity(activityId);

        Long challengeId =
                activity.getChallenge().getId();

        int dayNumber =
                activity.getDayNumber();


        activityRepository.delete(activity);


        String redisKey =
                buildRedisKey(
                        challengeId,
                        dayNumber
                );

        Object cachedData =
                redisTemplate.opsForValue()
                        .get(redisKey);

        if (cachedData != null) {

            log.info(
                    "Redis cache found while deleting activity."
            );

            List<ActivityResponse> cachedActivities =
                    convertToActivityList(cachedData);

            cachedActivities =
                    new ArrayList<>(cachedActivities);

            boolean removed =
                    cachedActivities.removeIf(
                            cachedActivity ->
                                    cachedActivity.id()
                                            .equals(activityId)
                    );

            if (removed) {

                redisTemplate.opsForValue()
                        .set(
                                redisKey,
                                cachedActivities,
                                Duration.ofMinutes(5)
                        );

                log.info(
                        "Activity ID {} removed from Redis.",
                        activityId
                );
            } else {

                log.info(
                        "Activity ID {} was not found in Redis.",
                        activityId
                );
            }
        } else {

            log.info(
                    "Redis cache not found while deleting activity."
            );
        }
    }


    @Override
    @Transactional
    public ActivityResponse updateActivity(
            ActivityUpdateRequest request) {

        log.info(
                "updateActivity service entered."
        );


        Activity activity =
                findActivity(request.activityId());


        activity.setTitle(request.newTitle());

        activityRepository.saveAndFlush(activity);


        String redisKey =
                buildRedisKey(
                        activity.getChallenge().getId(),
                        activity.getDayNumber()
                );


        Object cachedData =
                redisTemplate.opsForValue()
                        .get(redisKey);

        if (cachedData != null) {

            log.info(
                    "Redis key available."
            );

            List<ActivityResponse> cachedActivities =
                    convertToActivityList(cachedData);

            log.info(
                    "cachedActivities created."
            );

            boolean updated =
                    false;

            for (int i = 0;
                 i < cachedActivities.size();
                 i++) {

                ActivityResponse cachedActivity =
                        cachedActivities.get(i);

                if (cachedActivity.id()
                        .equals(activity.getId())) {

                    log.info(
                            "Activity ID {} found in Redis.",
                            activity.getId()
                    );

                    cachedActivities.set(
                            i,
                            buildActivityResponse(activity)
                    );

                    updated = true;

                    break;
                }
            }

            if (updated) {

                redisTemplate.opsForValue()
                        .set(
                                redisKey,
                                cachedActivities,
                                Duration.ofMinutes(5)
                        );

                log.info(
                        "Activity ID {} updated in Redis.",
                        activity.getId()
                );

            } else {

                log.info(
                        "Activity ID {} was not found in Redis.",
                        activity.getId()
                );
            }

        } else {

            log.info(
                    "Redis key not available. Database updated only."
            );
        }


        log.info(
                "Activity updated successfully."
        );

        return buildActivityResponse(activity);
    }


    @Override
    public List<ActivityResponse> getAllActivitiesByDay(
            Long challengeId,
            int dayNumber) {

        log.info(
                "Fetching activities. Challenge ID: {}, Day: {}",
                challengeId,
                dayNumber
        );

        String redisKey =
                buildRedisKey(
                        challengeId,
                        dayNumber
                );


        Object cachedData =
                redisTemplate.opsForValue()
                        .get(redisKey);

        if (cachedData != null) {

            log.info(
                    "Activities found in Redis."
            );

            return convertToActivityList(cachedData);
        }


        Challenge challenge =
                challengeRepository.findById(challengeId)
                        .orElseThrow(() ->
                                new ChallengeNotFoundException(
                                        "Challenge not found."
                                )
                        );


        List<ActivityResponse> responses =
                challenge.getActivities()
                        .stream()
                        .filter(activity ->
                                activity.getDayNumber()
                                        == dayNumber
                        )
                        .map(this::buildActivityResponse)
                        .toList();


        redisTemplate.opsForValue()
                .set(
                        redisKey,
                        responses,
                        Duration.ofMinutes(5)
                );

        log.info(
                "Activities fetched from database and cached in Redis."
        );

        return responses;
    }



    private Activity findActivity(Long id) {

        return activityRepository.findById(id)
                .orElseThrow(() ->
                        new ActivityNotFoundException(
                                "Activity not found"
                        )
                );
    }



    private String buildRedisKey(
            Long challengeId,
            int dayNumber) {

        return "activities:challenge:"
                + challengeId
                + ":day:"
                + dayNumber;
    }


    private ActivityResponse buildActivityResponse(
            Activity activity) {

        return ActivityResponse.builder()
                .id(activity.getId())
                .dayNumber(activity.getDayNumber())
                .title(activity.getTitle())
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .build();
    }



    private List<ActivityResponse> convertToActivityList(
            Object cachedData) {

        return objectMapper.convertValue(
                cachedData,
                new TypeReference<List<ActivityResponse>>() {}
        );
    }
}