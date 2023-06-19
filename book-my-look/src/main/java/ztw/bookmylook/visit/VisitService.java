package ztw.bookmylook.visit;

import org.springframework.stereotype.Service;
import ztw.bookmylook.availabilty.Availability;
import ztw.bookmylook.availabilty.AvailabilityService;
import ztw.bookmylook.client.Client;
import ztw.bookmylook.client.ClientService;
import ztw.bookmylook.employee.Employee;
import ztw.bookmylook.employee.EmployeeService;
import ztw.bookmylook.exceptions.VisitAlreadyExistsException;
import ztw.bookmylook.salonservice.SalonService;
import ztw.bookmylook.salonservice.SalonServiceRepository;
import ztw.bookmylook.visit.dto.VisitDto;
import ztw.bookmylook.visit.dto.VisitPostDto;
import ztw.bookmylook.visit.dto.VisitSlotDto;
import ztw.bookmylook.visit.visitpart.VisitPart;
import ztw.bookmylook.visit.visitpart.VisitPartService;

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
    public final static int MIN_BLOCK_TIME = 5;
    private final VisitRepository visitRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final VisitPartService visitPartService;
    private final AvailabilityService availabilityService;
    private final EmployeeService employeeService;

    private final ClientService clientService;

    public VisitService(VisitRepository visitRepository, AvailabilityService availabilityService,
                        SalonServiceRepository salonServiceRepository, EmployeeService employeeService,
                        ClientService clientService, VisitPartService visitPartService) {
        this.visitRepository = visitRepository;
        this.availabilityService = availabilityService;
        this.salonServiceRepository = salonServiceRepository;
        this.employeeService = employeeService;
        this.clientService = clientService;
        this.visitPartService = visitPartService;
    }

    public List<VisitDto> getVisitsForEmployee(long employeeId, LocalDate startDate, LocalDate endDate) {
        employeeService.checkIfEmployeeExists(employeeId);
        validateDateRange(startDate, endDate);

        return visitRepository.findAllByEmployeeIdAndDateBetween(employeeId, startDate, endDate).stream()
                .map(v -> new VisitDto(
                        v.getId(), v.getDate(), v.getStartTime(), v.getEndTime(), v.getSalonService(),
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

        checkIfEmployeeHasSalonService(employee, visit.getSalonServiceId());
        checkIfEmployeeIsAvailable(employee, visit.getDate(), visit.getStartTime(), salonService);
        checkIfThereAreNoOtherVisitsInThatTime(employee, visit.getDate(), visit.getStartTime(), salonService);

        Client client = clientService.addClient(visit.getClient());
        Visit newVisit = new Visit(visit.getDate(), visit.getStartTime(), salonService, employee, client);
        if(newVisit.getDate().isBefore(LocalDate.now()))
        {
            throw new IllegalArgumentException("Visit date cannot be in the past");
        }
        visitRepository.saveAndFlush(newVisit);

        List<VisitPart> visitParts = divideVisitIntoParts(newVisit, salonService.getDuration());

        try {
            visitPartService.addVisitParts(visitParts);
        } catch (Exception e) {
            visitRepository.delete(newVisit);
            clientService.deleteClient(client.getId());
            throw new VisitAlreadyExistsException(newVisit.getDate(), newVisit.getStartTime(), newVisit.getEmployee().getId());
        }
        return newVisit;
    }


    public Visit updateVisit(long visitId, VisitPostDto visit) {
        Visit visitToUpdate = visitRepository.findById(visitId).orElseThrow(
                () -> new NoSuchElementException("Visit with id " + visitId + " does not exist")
        );
        Employee employee = employeeService.getEmployeeById(visit.getEmployeeId());
        SalonService salonService = salonServiceRepository.findById(visit.getSalonServiceId()).orElseThrow(
                () -> new NoSuchElementException("Salon service with id " + visit.getSalonServiceId() + " does not exist")
        );

        checkIfEmployeeHasSalonService(employee, visit.getSalonServiceId());
        checkIfEmployeeIsAvailable(employee, visit.getDate(), visit.getStartTime(), salonService);

        if(visit.getDate().isBefore(LocalDate.now()))
        {
            throw new IllegalArgumentException("Visit date cannot be in the past");
        }
        visitToUpdate.setDate(visit.getDate());
        visitToUpdate.setStartTime(visit.getStartTime());
        visitToUpdate.setSalonService(salonService);
        visitToUpdate.setEmployee(employee);


        List<VisitPart> newVisitParts = divideVisitIntoParts(visitToUpdate, salonService.getDuration());
        List<VisitPart> visitPartsToDelete = new ArrayList<>();

        visitPartService.updateVisitParts(newVisitParts, visitPartsToDelete, visitId);

        // add new visit parts
        try {
            visitPartService.addVisitParts(newVisitParts);
        } catch (Exception e) {
            throw new VisitAlreadyExistsException(visitToUpdate.getDate(), visitToUpdate.getStartTime(),
                    visitToUpdate.getEmployee().getId());
        }

        // delete visit parts
        visitPartService.deleteVisitParts(visitPartsToDelete);

        Client client = visitToUpdate.getClient();
        clientService.updateClient(client.getId(), visit.getClient());

        return visitRepository.saveAndFlush(visitToUpdate);
    }

    public void deleteVisit(long visitId) {
        Visit visit = visitRepository.findById(visitId).orElseThrow(
                () -> new NoSuchElementException("Visit with id " + visitId + " does not exist")
        );

        visitPartService.deleteVisitPartsByVisitId(visitId);
        visitRepository.deleteById(visitId);
        clientService.deleteClient(visit.getClient().getId());
    }

    private void checkIfEmployeeHasSalonService(Employee employee, long salonServiceId){
        if (!employeeService.checkIfEmployeeHasSalonService(employee.getId(), salonServiceId)) {
            throw new IllegalArgumentException("Employee with id " + employee.getId() +
                    " does not have salon service with id " + salonServiceId);
        }
    }

    private void checkIfEmployeeIsAvailable(Employee employee, LocalDate date, LocalTime startTime, SalonService salonService){
        LocalTime endTime = startTime.plusMinutes(salonService.getDuration());
        if(availabilityService.checkIfEmployeeIsAvailable(employee.getId(), date, startTime, endTime)==null){
            throw new IllegalArgumentException("Employee with id " + employee.getId() +
                    " is not available on " + date + " between " + startTime + " and " + endTime);
        }
    }

    private void checkIfThereAreNoOtherVisitsInThatTime(Employee employee, LocalDate date, LocalTime startTime, SalonService salonService) {
        LocalTime endTime = startTime.plusMinutes(salonService.getDuration());
        if (visitRepository.findAllByEmployeeIdAndDate(employee.getId(), date).stream()
                .anyMatch(v -> v.getStartTime().isBefore(endTime)
                        && v.getStartTime().plusMinutes(v.getDuration()).isAfter(startTime))) {
            throw new VisitAlreadyExistsException(date, startTime, employee.getId());
        }
    }

    private List<VisitPart> divideVisitIntoParts(Visit visit, int duration){
        List<VisitPart> visitParts = new ArrayList<>();
        LocalTime currentStartTime = visit.getStartTime();
        LocalTime endTime = currentStartTime.plusMinutes(duration);
        while (!currentStartTime.plusMinutes(MIN_BLOCK_TIME).isAfter(endTime)) {
            visitParts.add(new VisitPart(visit.getDate(), currentStartTime, visit.getEmployee(), visit));
            currentStartTime = currentStartTime.plusMinutes(MIN_BLOCK_TIME);
        }
        return visitParts;
    }
}
