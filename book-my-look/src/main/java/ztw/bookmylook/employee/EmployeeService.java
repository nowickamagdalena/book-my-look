package ztw.bookmylook.employee;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(long id) throws NoSuchElementException {
        return employeeRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Employee with id " + id + " does not exist")
        );
    }

    public void checkIfEmployeeExists(long id) throws NoSuchElementException {
        if(!employeeRepository.existsById(id)) {
            throw  new NoSuchElementException("Employee with id " + id + " does not exist");
        }
    }

    public boolean checkIfEmployeeHasSalonService(long employeeId, long salonServiceId) {
        return employeeRepository.existsByIdAndAvailableServicesId(employeeId, salonServiceId);
    }
}
