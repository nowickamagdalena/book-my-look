package ztw.bookmylook.visit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    List<Visit> findAllByEmployeeIdAndDateBetween(long employeeId, LocalDate startDate, LocalDate endDate);

    List<Visit> findAllByEmployeeIdAndDate(long employeeId, LocalDate date);
}
