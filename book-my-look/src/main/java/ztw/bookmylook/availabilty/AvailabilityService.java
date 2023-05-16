package ztw.bookmylook.availabilty;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import ztw.bookmylook.availabilty.dto.AvailabilityDto;
import ztw.bookmylook.employee.EmployeeService;
import ztw.bookmylook.exceptions.AvailabilityConflictException;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import static ztw.bookmylook.utils.DateUtils.validateDateRange;

@Service
public class AvailabilityService {
    private final AvailabilityRepository availabilityRepository;
    private final EmployeeService employeeService;

    private final ModelMapper modelMapper;

    public AvailabilityService(AvailabilityRepository availabilityRepository, EmployeeService employeeService) {
        this.availabilityRepository = availabilityRepository;
        this.employeeService = employeeService;
        this.modelMapper = new ModelMapper();
    }

    public List<Availability> getEmployeesAvailabilitiesForDates(long employeeId, LocalDate startDate,
                                                                 LocalDate endDate) {
        validateDateRange(startDate, endDate);
        employeeService.checkIfEmployeeExists(employeeId);
        return availabilityRepository.findAllByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
    }

    public Availability addEmployeeAvailability(long employeeId, AvailabilityDto availabilityDto) {
        employeeService.checkIfEmployeeExists(employeeId);
        Availability availability = modelMapper.map(availabilityDto, Availability.class);
        availability.setEmployeeId(employeeId);
        validateAvailability(availability);
        return availabilityRepository.save(availability);
    }

    public void deleteAvailability(long employeeId, long availabilityId) {
        var availability = getAvailabilityById(availabilityId);
        checkIfEmployeeHasAccessToAvailability(employeeId, availability);
        availabilityRepository.delete(availability);
    }

    public Availability updateAvailability(long employeeId, long availabilityId, AvailabilityDto availabilityDto) {
        employeeService.checkIfEmployeeExists(employeeId);
        var availability = getAvailabilityById(availabilityId);
        checkIfEmployeeHasAccessToAvailability(employeeId, availability);
        modelMapper.map(availabilityDto, availability);
        validateAvailability(availability);
        return availabilityRepository.save(availability);
    }

    private void checkIfEmployeeHasAccessToAvailability(long employeeId, Availability availability) {
        if (employeeId != availability.getEmployeeId()) {
            throw new IllegalArgumentException("Availability with id " + availability.getId() + " does not belong to " +
                    "employee with id " + employeeId);
        }
    }

    private void validateAvailability(Availability availability) {
        if (!availability.getStartTime().isBefore(availability.getEndTime())) {
            throw new IllegalArgumentException("Start time cannot be equal to or after end time");
        }
        if (availability.getStartTime().getMinute() % 15 != 0 || availability.getEndTime().getMinute() % 15 != 0) {
            throw new IllegalArgumentException("Start and end time must be divisible by 15 minutes");
        }
        availabilityRepository.findAllByEmployeeIdAndDate(availability.getEmployeeId(), availability.getDate()).forEach(
                a -> {
                    if (hasConflictWithOtherAvailability(availability, a)) {
                        throw new AvailabilityConflictException(a.getId());
                    }
                }
        );

    }

    private boolean hasConflictWithOtherAvailability(Availability availability, Availability other) {
        return (availability.getId() == null || !availability.getId().equals(other.getId()))
                && !(!other.getEndTime().isAfter(availability.getStartTime())
                || !other.getStartTime().isBefore(availability.getEndTime()));
    }

    private Availability getAvailabilityById(long id) throws NoSuchElementException {
        return availabilityRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Availability with id " + id + " does not exist")
        );
    }
}
