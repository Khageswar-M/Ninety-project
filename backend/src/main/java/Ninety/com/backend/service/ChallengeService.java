package Ninety.com.backend.service;

import Ninety.com.backend.dto.response.ChallengeResponse;

public interface ChallengeService {
    ChallengeResponse createChallenge(Long userId);
}
