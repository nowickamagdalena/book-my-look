package ztw.bookmylook.visit.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import ztw.bookmylook.client.dto.ClientDto;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class VisitDto {
    @Schema(description = "Visit id", example = "1")
    private Long id;
    @Schema(description = "Visit date", example = "2021-06-01")
    private final LocalDate date;
    @Schema(description = "Visit start time", example = "10:00")
    private final LocalTime startTime;
    @Schema(description = "Visit end time", example = "11:00")
    private final LocalTime endTime;
    @Schema(description = "Salon service name", example = "Haircut")
    private final String salonServiceName;
    private final ClientDto client;

    public VisitDto(Long id, LocalDate date, LocalTime startTime, LocalTime endTime, String salonServiceName, ClientDto client) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.salonServiceName = salonServiceName;
        this.client = client;
    }
}
