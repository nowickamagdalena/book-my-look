package ztw.bookmylook.visit;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ztw.bookmylook.visit.dto.VisitSlotDto;

import java.time.LocalDate;
import java.util.List;

@RestController
public class VisitController {
    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @GetMapping("/visits/slots")
    @Operation(summary = "Get employees slots for salon service", description = "Get employees slots for salon " +
            "service within specified dates")
    public ResponseEntity<List<VisitSlotDto>> getEmployeesSlotsForSalonService(
            @RequestParam long employeeId,
            @RequestParam long salonServiceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(
                visitService.getEmployeesSlotsForSalonService(employeeId, salonServiceId, startDate, endDate)
        );
    }
}
