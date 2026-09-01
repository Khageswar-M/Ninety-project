package Ninety.com.backend.io.request;


import jakarta.validation.constraints.NotBlank;

public record UpdateUserNameRequest(
        @NotBlank(message = "Name must not be blank")
        String newName
) {
}
