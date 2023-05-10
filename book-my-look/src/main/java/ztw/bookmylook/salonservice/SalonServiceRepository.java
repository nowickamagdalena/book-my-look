package ztw.bookmylook.salonservice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalonServiceRepository extends JpaRepository<SalonService, Long> {
}
