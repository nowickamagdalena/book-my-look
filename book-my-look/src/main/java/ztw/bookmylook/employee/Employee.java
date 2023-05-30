package ztw.bookmylook.employee;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ztw.bookmylook.employee.dto.EmployeeDetailsDTO;
import ztw.bookmylook.salonservice.SalonService;

import javax.persistence.*;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String email;

    @ManyToMany
    @JoinTable(
            name = "employee_service",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<SalonService> availableServices;

    public Employee(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public static EmployeeDetailsDTO toEmployeeDetailsDTO(Employee employee) {
        return new EmployeeDetailsDTO(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail()
        );
    }
}
