package ztw.bookmylook.salonservice;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SalonServiceService {
    private final SalonServiceRepository salonServiceRepository;

    public SalonServiceService(SalonServiceRepository salonServiceRepository) {
        this.salonServiceRepository = salonServiceRepository;
    }

    public SalonService getSalonServiceById(long id) {
        return salonServiceRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Salon service with id " + id + " does not exist")
        );
    }

    public List<SalonService> getAllSalonServices() {
        return salonServiceRepository.findAll();
    }

}
