package Ninety.com.backend.io.request;

public record CoachRequest(
        int age,
        double weight,
        double height,
        String goal,
        String experience,
        int dayAvailable
) {
}
