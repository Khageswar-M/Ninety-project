package Ninety.com.backend.service;

import Ninety.com.backend.io.response.ChallengeResponse;
import Ninety.com.backend.io.response.ChallengesResponse;

import java.util.List;

public interface ChallengeService {
    ChallengeResponse createChallenge();

    List<ChallengesResponse> getChallengesByUserId(Long userId);

    void deleteChallenge(Long challengeId);

    int getMyCurrentStreakDay(Long challengeId);

    void computeStreakCounts(Long challengeId);

}
