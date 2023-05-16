package ztw.bookmylook.visit.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalTime;

public record VisitSlotDto(
        @Schema(description = "Date of visit", example = "2021-06-01")
        LocalDate date,
        @Schema(description = "Start time of visit", example = "10:00")
        LocalTime startTime,
        @Schema(description = "End time of visit", example = "11:00")
        LocalTime endTime) {
}
