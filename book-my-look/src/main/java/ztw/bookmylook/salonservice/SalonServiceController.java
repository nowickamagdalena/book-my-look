package ztw.bookmylook.salonservice;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SalonServiceController {

    private final SalonServiceService salonServiceService;

    public SalonServiceController(SalonServiceService salonServiceService) {
        this.salonServiceService = salonServiceService;
    }

    @GetMapping("/salonservices")
    @Operation(summary = "Get all salon services", description = "Get all salon services")
    public ResponseEntity<List<SalonService>> getAllSalonServices() {
        return ResponseEntity.ok(salonServiceService.getAllSalonServices());
    }

    @GetMapping("/salonservices/{salonServiceId}")
    @Operation(summary = "Get salon service by id", description = "Get salon service by id")
    public ResponseEntity<SalonService> getSalonServiceById(@PathVariable long salonServiceId) {
        return ResponseEntity.ok(salonServiceService.getSalonServiceById(salonServiceId));
    }
}
