package ztw.bookmylook.availabilty;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import ztw.bookmylook.availabilty.dto.AvailabilityDto;
import ztw.bookmylook.employee.EmployeeService;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AvailabilityService {
    private AvailabilityRepository availabilityRepository;
    private EmployeeService employeeService;

    private ModelMapper modelMapper;

    public AvailabilityService(AvailabilityRepository availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }

    public List<Availability> getEmployeesAvailabilitiesForDates(long employeeId, LocalDate startDate, LocalDate endDate) {
        employeeService.checkIfEmployeeExists(employeeId);
        return availabilityRepository.findAllByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
    }

    public Availability addEmployeeAvailability(long employeeId, AvailabilityDto availabilityDto) {
        employeeService.checkIfEmployeeExists(employeeId);
        Availability availability = modelMapper.map(availabilityDto, Availability.class);
        availability.setEmployeeId(employeeId);
        return availabilityRepository.save(availability);
    }

    public void deleteAvailability(long availabilityId) {
        var availability = getAvailabilityById(availabilityId);
        availabilityRepository.delete(availability);
    }

    public Availability updateAvailability(long availabilityId, AvailabilityDto availabilityDto) {
        var availability = getAvailabilityById(availabilityId);
        modelMapper.map(availabilityDto, availability);
        return availabilityRepository.save(availability);
    }

    private Availability getAvailabilityById(long id) throws NoSuchElementException {
        return availabilityRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Availability with id " + id + " does not exist")
        );
    }
}
