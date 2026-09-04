package Ninety.com.backend.service;

import Ninety.com.backend.io.request.ActivityUpdateRequest;
import Ninety.com.backend.io.request.CreateActivityRequest;
import Ninety.com.backend.io.response.ActivityResponse;

import java.util.List;

public interface ActivityService {

    ActivityResponse createActivity(CreateActivityRequest request);

    void deleteActivity(Long activityId);

    ActivityResponse updateActivity(ActivityUpdateRequest request);

    List<ActivityResponse> getAllActivitiesByDay(Long challengeId, int dayNumber);
}
