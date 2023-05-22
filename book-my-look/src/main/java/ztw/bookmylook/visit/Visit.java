package ztw.bookmylook.visit;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ztw.bookmylook.client.Client;
import ztw.bookmylook.employee.Employee;
import ztw.bookmylook.salonservice.SalonService;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@Getter
@Setter
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

    public LocalTime getEndTime() {
        return startTime.plusMinutes(salonService.getDuration());
    }

    public Visit(LocalDate date, LocalTime startTime, SalonService salonService, Employee employee, Client client) {
        this.date = date;
        this.startTime = startTime;
        this.salonService = salonService;
        this.employee = employee;
        this.client = client;
    }
}
