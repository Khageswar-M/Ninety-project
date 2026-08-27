package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.ActivityUpdateRequest;
import Ninety.com.backend.dto.request.CreateActivityRequest;
import Ninety.com.backend.dto.response.ActivityResponse;

import java.util.List;

public interface ActivityService {

    ActivityResponse createActivity(CreateActivityRequest request);

    void deleteActivity(Long activityId);

    ActivityResponse updateActivity(ActivityUpdateRequest request);

    List<ActivityResponse> getAllActivitiesByDay(Long challengeId, int dayNumber);
}
