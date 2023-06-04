package ztw.bookmylook.visit.visitpart;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitPartRepository extends JpaRepository<VisitPart, Long> {
    List<VisitPart> findAllByVisitId(long visitId);
}
