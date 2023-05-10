package ztw.bookmylook.exceptions;

public class AvailabilityConflictException extends RuntimeException {
    public AvailabilityConflictException(Long id) {
        super("Employee already has availability for this time period with id: " + id);
    }
}
