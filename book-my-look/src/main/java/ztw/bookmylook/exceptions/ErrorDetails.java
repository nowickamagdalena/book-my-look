package ztw.bookmylook.exceptions;


public record ErrorDetails(java.time.LocalDateTime timestamp, String message, String details) {
}
