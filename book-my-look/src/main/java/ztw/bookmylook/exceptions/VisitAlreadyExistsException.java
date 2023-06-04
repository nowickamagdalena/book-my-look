package ztw.bookmylook.exceptions;

import java.time.LocalDate;
import java.time.LocalTime;

public class VisitAlreadyExistsException extends RuntimeException {
    public VisitAlreadyExistsException(LocalDate date, LocalTime time, Long employeeId) {
        super("Visit already exists for date: " + date + ", time: " + time + ", employee id: " + employeeId);
    }
}
