package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.CreateActivityRequest;
import Ninety.com.backend.dto.response.ActivityResponse;

public interface ActivityService {

    ActivityResponse createActivity(CreateActivityRequest request);

    void deleteActivity(Long activityId);
}
