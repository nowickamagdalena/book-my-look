package ztw.bookmylook.availabilty;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findAllByEmployeeIdAndDateBetween(long employeeId, LocalDate startDate, LocalDate endDate);

    List<Availability> findAllByEmployeeIdAndDate(long employeeId, LocalDate date);
}
