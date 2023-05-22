package ztw.bookmylook.visit;

import org.springframework.stereotype.Service;
import ztw.bookmylook.availabilty.Availability;
import ztw.bookmylook.availabilty.AvailabilityService;
import ztw.bookmylook.client.Client;
import ztw.bookmylook.client.ClientService;
import ztw.bookmylook.employee.Employee;
import ztw.bookmylook.employee.EmployeeService;
import ztw.bookmylook.salonservice.SalonService;
import ztw.bookmylook.salonservice.SalonServiceRepository;
import ztw.bookmylook.visit.dto.VisitDto;
import ztw.bookmylook.visit.dto.VisitPostDto;
import ztw.bookmylook.visit.dto.VisitSlotDto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import static ztw.bookmylook.utils.DateUtils.validateDateRange;

@Service
public class VisitService {
    public final static int MIN_BLOCK_TIME = 15;
    private final VisitRepository visitRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final AvailabilityService availabilityService;
    private final EmployeeService employeeService;

    private final ClientService clientService;

    public VisitService(VisitRepository visitRepository, AvailabilityService availabilityService,
                        SalonServiceRepository salonServiceRepository, EmployeeService employeeService,
                        ClientService clientService) {
        this.visitRepository = visitRepository;
        this.availabilityService = availabilityService;
        this.salonServiceRepository = salonServiceRepository;
        this.employeeService = employeeService;
        this.clientService = clientService;
    }

    public List<VisitDto> getVisitsForEmployee(long employeeId, LocalDate startDate, LocalDate endDate) {
        employeeService.checkIfEmployeeExists(employeeId);
        validateDateRange(startDate, endDate);

        return visitRepository.findAllByEmployeeIdAndDateBetween(employeeId, startDate, endDate).stream()
                .map(v -> new VisitDto(
                        v.getId(), v.getDate(), v.getStartTime(), v.getEndTime(), v.getSalonService().getName(),
                        clientService.mapClientToDto(v.getClient()))
                )
                .toList();
    }

    public List<VisitSlotDto> getEmployeesSlotsForSalonService(long employeeId, long salonServiceId,
                                                               LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);
        employeeService.checkIfEmployeeExists(employeeId);
        int duration = getSalonServiceDuration(salonServiceId);
        return availabilityService.getEmployeesAvailabilitiesForDates(employeeId, startDate, endDate).stream()
                .collect(Collectors.groupingBy(Availability::getDate)).entrySet().stream()
                .map(day -> {
                    day.getValue().sort(Comparator.comparing(Availability::getStartTime));
                            List<Visit> bookedVisits = visitRepository.findAllByEmployeeIdAndDate(employeeId,
                                    day.getKey());
                            return getPossibleSlotsForDate(day.getValue(), duration, bookedVisits);
                        }
                ).flatMap(List::stream).toList();
    }

    private List<VisitSlotDto> getPossibleSlotsForDate(List<Availability> availabilities, int duration,
                                                       List<Visit> bookedVisits) {
        List<VisitSlotDto> availableSlotsForDate = new ArrayList<>();
        for (Availability availability : availabilities) {
            LocalTime currentStartTime = availability.getStartTime();

            while (!currentStartTime.plusMinutes(duration).isAfter(availability.getEndTime())) {
                LocalTime slotEndTime = currentStartTime.plusMinutes(duration);

                if (noOtherOtherVisitsBookedInSlotTime(bookedVisits, currentStartTime, slotEndTime)) {
                    availableSlotsForDate.add(new VisitSlotDto(availability.getDate(), currentStartTime, slotEndTime));
                    currentStartTime = slotEndTime;
                } else {
                    currentStartTime = currentStartTime.plusMinutes(MIN_BLOCK_TIME);
                }
            }
        }
        return availableSlotsForDate;
    }

    private int getSalonServiceDuration(long salonServiceId) {
        return salonServiceRepository.findById(salonServiceId).map(SalonService::getDuration).orElseThrow(
                () -> new NoSuchElementException("Salon service with id " + salonServiceId + " does not exist")
        );
    }

    private boolean noOtherOtherVisitsBookedInSlotTime(List<Visit> bookedVisits, LocalTime currentStartTime,
                                                       LocalTime slotEndTime) {
        return bookedVisits.stream().allMatch(v -> !v.getStartTime().isBefore(slotEndTime)
                || !v.getStartTime().plusMinutes(v.getDuration()).isAfter(currentStartTime)
        );
    }

    public Visit addVisit(VisitPostDto visit) {
        Employee employee = employeeService.getEmployeeById(visit.getEmployeeId());
        SalonService salonService = salonServiceRepository.findById(visit.getSalonServiceId()).orElseThrow(
                () -> new NoSuchElementException("Salon service with id " + visit.getSalonServiceId() + " does not exist")
        );

        Client client = clientService.addClient(visit.getClient());
        Visit newVisit = new Visit(visit.getDate(), visit.getStartTime(), salonService, employee, client);
        return visitRepository.save(newVisit);
    }


    public Visit updateVisit(long visitId, VisitPostDto visit) {
        Visit visitToUpdate = visitRepository.findById(visitId).orElseThrow(
                () -> new NoSuchElementException("Visit with id " + visitId + " does not exist")
        );
        Employee employee = employeeService.getEmployeeById(visit.getEmployeeId());
        SalonService salonService = salonServiceRepository.findById(visit.getSalonServiceId()).orElseThrow(
                () -> new NoSuchElementException("Salon service with id " + visit.getSalonServiceId() + " does not exist")
        );

        visitToUpdate.setDate(visit.getDate());
        visitToUpdate.setStartTime(visit.getStartTime());
        visitToUpdate.setSalonService(salonService);
        visitToUpdate.setEmployee(employee);

        Client client = visitToUpdate.getClient();
        clientService.updateClient(client.getId(), visit.getClient());

        return visitRepository.save(visitToUpdate);
    }

    public void deleteVisit(long visitId) {
        visitRepository.deleteById(visitId);
    }
}
