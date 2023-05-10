package ztw.bookmylook.availabilty;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ztw.bookmylook.availabilty.dto.AvailabilityDto;

import java.time.LocalDate;
import java.util.List;

@RestController
public class AvailabilityController {
    private AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/availabilities/employee/{employeeId}")
    public ResponseEntity<List<Availability>> getEmployeesAvailabilitiesForDates(@PathVariable long employeeId,
                                                                                 @RequestParam LocalDate startDate,
                                                                                 @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(availabilityService.getEmployeesAvailabilitiesForDates(employeeId, startDate,
                endDate));
    }

    @PostMapping("/availabilities/employee/{employeeId}")
    public ResponseEntity<Availability> addEmployeeAvailability(@PathVariable long employeeId,
                                                                @RequestBody AvailabilityDto availabilityDto) {
        return ResponseEntity.ok(availabilityService.addEmployeeAvailability(employeeId, availabilityDto));
    }
}
