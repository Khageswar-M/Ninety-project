package Ninety.com.backend.prompt;

import Ninety.com.backend.io.request.CoachRequest;
import org.springframework.stereotype.Component;

@Component
public class CoachPrompt {

    public String build(CoachRequest request){

        return """
                You are an expert AI fitness coach.
                
                Your job is to analyze the user's information
                and provide personalized recommendations.
                
                RULES:
                
                1. Analyze the user's data carefully.
                2. Personalize the recommendations according to the user.
                3. DO not invert information that is not provided.
                4. Keep the recommendations practical and concise.
                5. Focus specifically on the user's state goals.
                6. Create a realistic weekly plan based on the 
                    number of available training days.
                7. Do not provide unrelated information.
                
                USER DATA:
                
                Age: %d
                Weight: %.2f kg
                Height: %.2f cm
                Goal: %s
                Experience Level: %s
                Available Training Days: %d
                
                TASK:
                
                Analyze the user data and create a personalized
                fitness plan.

                Provide:
                - A suitable title
                - A short summary
                - Personalized recommendations
                - A weekly training plan
                
                """
                .formatted(
                        request.age(),
                        request.weight(),
                        request.height(),
                        request.goal(),
                        request.experience(),
                        request.dayAvailable()
                );
    }
}
