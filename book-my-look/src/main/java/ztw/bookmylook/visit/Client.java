package ztw.bookmylook.visit;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
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
