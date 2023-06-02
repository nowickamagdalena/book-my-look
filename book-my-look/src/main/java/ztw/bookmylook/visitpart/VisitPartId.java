package ztw.bookmylook.visitpart;

import lombok.*;
import ztw.bookmylook.employee.Employee;

import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class VisitPartId implements Serializable {
    private LocalDate date;
    private LocalTime time;

    @ManyToOne
    private Employee employee;
}
