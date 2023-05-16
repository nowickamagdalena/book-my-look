package ztw.bookmylook.visit;

import lombok.Getter;
import lombok.NoArgsConstructor;
import ztw.bookmylook.employee.Employee;
import ztw.bookmylook.salonservice.SalonService;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@Getter
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    private LocalTime startTime;

    @ManyToOne
    private SalonService salonService;
    @ManyToOne
    private Employee employee;

    @OneToOne
    private Client client;

    public int getDuration() {
        return salonService.getDuration();
    }
}