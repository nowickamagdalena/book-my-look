package ztw.bookmylook.visit.visitpart;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitPartService {

    private final VisitPartRepository visitPartRepository;
    
    public VisitPartService(VisitPartRepository visitPartRepository) {
        this.visitPartRepository = visitPartRepository;
    }
    
    public List<VisitPart> getAllVisitPartsByVisitId(long visitId) {
        return visitPartRepository.findAllByVisitId(visitId);
    }
        
    public List<VisitPart> addVisitParts(List<VisitPart> visitParts){
        return visitPartRepository.saveAllAndFlush(visitParts);
    }

    public void updateVisitParts(List<VisitPart> newVisitParts, List<VisitPart> visitPartsToDelete, long visitId){
        List<VisitPart> visitParts = getAllVisitPartsByVisitId(visitId);

        for (VisitPart visitPart : visitParts) {
            boolean isVisitPartToBeDeleted = true;
            for (VisitPart newVisitPart : newVisitParts) {
                if (visitPart.getTime().equals(newVisitPart.getTime())
                        && visitPart.getDate().equals(newVisitPart.getDate())
                        && visitPart.getEmployee().getId() == newVisitPart.getEmployee().getId()) {

                    newVisitParts.remove(newVisitPart);
                    isVisitPartToBeDeleted = false;
                    break;
                }
            }
            if (isVisitPartToBeDeleted)
                visitPartsToDelete.add(visitPart);
        }
    }

    public void deleteVisitPartsByVisitId(long visitId){
        List<VisitPart> visitParts = visitPartRepository.findAllByVisitId(visitId);
        visitPartRepository.deleteAll(visitParts);
    }

    public void deleteVisitParts(List<VisitPart> visitPartsToDelete){
        visitPartRepository.deleteAll(visitPartsToDelete);
    }
}
