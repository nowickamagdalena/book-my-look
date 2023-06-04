package ztw.bookmylook.visit.visitpart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import ztw.bookmylook.employee.Employee;
import ztw.bookmylook.visit.Visit;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Immutable
@Table(uniqueConstraints = @UniqueConstraint(name = "UniqueVisitPart", columnNames = {"date", "time", "employee_id"}))
public class VisitPart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private LocalTime time;

    @ManyToOne
    private Employee employee;

    @ManyToOne
    private Visit visit;

    public VisitPart(LocalDate date, LocalTime currentStartTime, Employee employee, Visit visit) {
        this.date = date;
        this.time = currentStartTime;
        this.employee = employee;
        this.visit = visit;
    }
}
