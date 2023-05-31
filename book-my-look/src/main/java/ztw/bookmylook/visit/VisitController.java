package ztw.bookmylook.visit;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ztw.bookmylook.visit.dto.VisitDto;
import ztw.bookmylook.visit.dto.VisitPostDto;
import ztw.bookmylook.visit.dto.VisitSlotDto;

import java.time.LocalDate;
import java.util.List;

@RestController
public class VisitController {
    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/visits/employee/{employeeId}")
    @Operation(summary = "Get visits for employee", description = "Get visits for employee within specified dates")
    public ResponseEntity<List<VisitDto>> getVisitsForEmployee(
            @PathVariable long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(visitService.getVisitsForEmployee(employeeId, startDate, endDate));
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

    @PostMapping("/visits")
    @Operation(summary = "Add visit booked by client", description = "Add visit booked by client")
    public ResponseEntity<Visit> addVisit(
            @RequestBody VisitPostDto visit
    ) {
        return new ResponseEntity<>(visitService.addVisit(visit), HttpStatus.CREATED);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/visits/{visitId}")
    @Operation(summary = "Update visit", description = "Update visit")
    public ResponseEntity<Visit> updateVisit(
            @PathVariable long visitId,
            @RequestBody VisitPostDto visit
    ) {
        return ResponseEntity.ok(visitService.updateVisit(visitId, visit));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/visits/{visitId}")
    @Operation(summary = "Delete visit", description = "Delete visit")
    public ResponseEntity<Void> deleteVisit(
            @PathVariable long visitId
    ) {
        visitService.deleteVisit(visitId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
