package Ninety.com.backend.service;

import Ninety.com.backend.io.response.ChallengeResponse;

import java.util.List;

public interface ChallengeService {
    ChallengeResponse createChallenge(Long userId);

    List<ChallengeResponse> getChallengesByUserId(Long userId);

    void deleteChallenge(Long challengeId);

    int getMyCurrentStreakDay(Long challengeId);

    void computeStreakCounts(Long challengeId);

}
