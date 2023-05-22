package ztw.bookmylook.client.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientDto {
    @Schema(description = "Client first name", example = "John")
    private String firstName;
    @Schema(description = "Client last name", example = "Doe")
    private String lastName;
    @Schema(description = "Client email", example = "example@gmail.com")
    private String email;
    @Schema(description = "Client phone number", example = "123456789")
    private String phoneNumber;
    @Schema(description = "Additional info", example = "Allergic to peanuts")
    private String additionalInfo;
}
