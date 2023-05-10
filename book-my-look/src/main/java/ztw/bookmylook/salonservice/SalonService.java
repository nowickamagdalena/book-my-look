package ztw.bookmylook.salonservice;

import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
public class SalonService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private int duration;
    private double price;
    private String description;

    public SalonService(String name, int duration, double price, String description) {
        this.name = name;
        this.duration = duration;
        this.price = price;
        this.description = description;
    }
}
