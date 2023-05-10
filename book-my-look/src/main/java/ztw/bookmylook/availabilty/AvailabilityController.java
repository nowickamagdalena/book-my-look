package ztw.bookmylook.availabilty;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ztw.bookmylook.availabilty.dto.AvailabilityDto;

import java.time.LocalDate;
import java.util.List;

@RestController
public class AvailabilityController {
    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/employees/{employeeId}/availabilities")
    @Operation(summary = "Get availabilities for employee", description = "Get availabilities for employee within " +
            "specified dates")
    public ResponseEntity<List<Availability>> getEmployeesAvailabilitiesForDates(@PathVariable long employeeId,
                                                                                 @RequestParam @DateTimeFormat(iso =
                                                                                         DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                                 @RequestParam @DateTimeFormat(iso =
                                                                                         DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(availabilityService.getEmployeesAvailabilitiesForDates(employeeId, startDate,
                endDate));
    }

    @PostMapping("/employees/{employeeId}/availabilities")
    @Operation(summary = "Add availability for employee", description = "Add availability for employee")
    public ResponseEntity<Availability> addEmployeeAvailability(@PathVariable long employeeId,
                                                                @RequestBody AvailabilityDto availabilityDto) {
        return new ResponseEntity<>(availabilityService.addEmployeeAvailability(employeeId, availabilityDto),
                HttpStatus.CREATED);
    }

    @PutMapping("/employees/{employeeId}/availabilities/{availabilityId}")
    @Operation(summary = "Update availability for employee", description = "Update availability for employee by id")
    public ResponseEntity<Availability> updateEmployeeAvailability(@PathVariable long employeeId,
                                                                   @PathVariable long availabilityId,
                                                                   @RequestBody AvailabilityDto availabilityDto) {
        return ResponseEntity.ok(availabilityService.updateAvailability(employeeId, availabilityId, availabilityDto));
    }

    @DeleteMapping("/employees/{employeeId}/availabilities/{availabilityId}")
    @Operation(summary = "Delete availability for employee", description = "Delete availability for employee by id")
    public ResponseEntity<Void> deleteEmployeeAvailability(@PathVariable long employeeId,
                                                           @PathVariable long availabilityId) {
        availabilityService.deleteAvailability(employeeId, availabilityId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
