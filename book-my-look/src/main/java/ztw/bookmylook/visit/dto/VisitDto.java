package ztw.bookmylook.visit.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import ztw.bookmylook.client.dto.ClientDto;
import ztw.bookmylook.salonservice.SalonService;

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
    @Schema(description = "Salon service id", example = "5")
    private final Long salonServiceId;
    @Schema(description = "Visit duration", example = "30")
    private final int duration;
    private final ClientDto client;

    public VisitDto(Long id, LocalDate date, LocalTime startTime, LocalTime endTime, SalonService salonService, ClientDto client) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.salonServiceName = salonService.getName();
        this.salonServiceId = salonService.getId();
        this.duration = salonService.getDuration();
        this.client = client;
    }
}
