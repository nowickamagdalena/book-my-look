package ztw.bookmylook.visitpart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ztw.bookmylook.visit.Visit;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VisitPart {
    @EmbeddedId
    private VisitPartId id;

    @ManyToOne
    private Visit visit;


}
