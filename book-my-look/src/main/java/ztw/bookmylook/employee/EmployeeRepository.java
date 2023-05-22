package ztw.bookmylook.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByIdAndAvailableServicesId(long employeeId, long salonServiceId);

    List<Employee> findByAvailableServicesId(long serviceId);


}
