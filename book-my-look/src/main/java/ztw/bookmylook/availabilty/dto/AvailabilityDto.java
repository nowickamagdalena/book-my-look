package ztw.bookmylook.availabilty.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class AvailabilityDto {
    @Schema(description = "Date", example = "2023-01-01")
    private LocalDate date;
    @Schema(description = "startTime", example = "12:00:00")
    private LocalTime startTime;
    @Schema(description = "endTime", example = "14:00:00")
    private LocalTime endTime;
}
