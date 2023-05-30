package ztw.bookmylook.employee;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ztw.bookmylook.employee.dto.EmployeeDetailsDTO;

import java.util.List;

@RestController
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/employees")
    @Operation(summary = "Get all employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employees/{email}/details")
    @Operation(summary = "Get logged employee details")
    public ResponseEntity<EmployeeDetailsDTO> getEmployeeDetailsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(Employee.toEmployeeDetailsDTO(employeeService.getEmployeeByEmail(email)));
    }

    @GetMapping("/employees/{id}")
    @Operation(summary = "Get employee by id")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/employees/services/{serviceId}")
    @Operation(summary = "Get employees who provide service with given id")
    public ResponseEntity<List<Employee>> getEmployeesByServiceId(@PathVariable long serviceId) {
        return ResponseEntity.ok(employeeService.getEmployeesByServiceId(serviceId));
    }
}
