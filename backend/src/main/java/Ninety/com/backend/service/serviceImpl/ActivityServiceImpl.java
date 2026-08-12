package Ninety.com.backend.service.serviceImpl;

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
import org.springframework.stereotype.Service;

import java.time.LocalDate;


@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {


    private final ChallengeRepository challengeRepository;
    private final ActivityRepository activityRepository;


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



        return ActivityResponse.builder()
                .id(newActivity.getId())
                .dayNumber(newActivity.getDayNumber())
                .title(newActivity.getTitle())
                .createdAt(newActivity.getCreatedAt())
                .updatedAt(newActivity.getUpdatedAt())
                .build();
    }

    @Override
    public void deleteActivity(Long activityId) {
        Activity activity = findActivity(activityId);

        activityRepository.delete(activity);
    }

    private Activity findActivity(Long id){
        Activity existingActivity = activityRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException("Activity not found"));

        return existingActivity;
    }
}
