package ztw.bookmylook.employee.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmployeeDetailsDTO {
    @Schema(description = "Employee id", example = "1")
    private long id;
    @Schema(description = "Employee first name", example = "John")
    private String firstName;
    @Schema(description = "Employee last name", example = "Smith")
    private String lastName;
    @Schema(description = "Employee email address", example = "example@example.com")
    private String email;
}
