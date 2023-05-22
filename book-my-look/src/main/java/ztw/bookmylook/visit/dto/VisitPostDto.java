package ztw.bookmylook.visit.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import ztw.bookmylook.client.dto.ClientDto;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class VisitPostDto {
    @Schema(description = "Visit date", example = "2021-06-01")
    private final LocalDate date;
    @Schema(description = "Visit start time", example = "10:00")
    private final LocalTime startTime;
    @Schema(description = "Salon service id", example = "1")
    private final long salonServiceId;
    @Schema(description = "Employee id", example = "1")
    private final long employeeId;
    @Schema(description = "Client data")
    private final ClientDto client;
}
