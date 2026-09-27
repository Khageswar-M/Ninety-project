package Ninety.com.backend.schedulers;

import Ninety.com.backend.entity.Challenge;
import Ninety.com.backend.repository.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChallengeScheduler {

    private final ChallengeRepository challengeRepository;

    @Scheduled(
            cron = "0 0 0 * * *",
            zone = "Asia/Kolkata"
    )
    @Transactional
    public void updateChallengeProgress(){
        log.info("Challenge progress scheduler started.");

        LocalDate today =
                LocalDate.now(
                        ZoneId.of("Asia/Kolkata")
                );

        List<Challenge> challenges =
                challengeRepository.findAllByCompletedFalse();

        for(Challenge challenge : challenges){

            LocalDate createdOn =
                    challenge.getCreatedAt();

            int daysPassed =
                    (int) ChronoUnit.DAYS.between(
                            createdOn,
                            today
                    ) + 1;

            if(daysPassed > 90){
                challenge.setCurrentDay(90);
                challenge.setCompleted(true);

                log.info(
                        "Challenge {} completed",
                        challenge.getId()
                );
            }else{
                challenge.setCurrentDay(daysPassed);

                log.info(
                        "Challenge {} current day updated to {}.",
                        challenge.getId(),
                        daysPassed
                );
            }
        }

        challengeRepository.saveAll(challenges);

        log.info("Challenge progress scheduler completed.");
    }

}
