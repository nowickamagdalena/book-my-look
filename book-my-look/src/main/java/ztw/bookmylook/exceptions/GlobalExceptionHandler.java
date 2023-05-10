package ztw.bookmylook.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorDetails> handleNoSuchElementException(NoSuchElementException e, WebRequest request) {
        ErrorDetails errorDetails = getErrorDetails(e, request);
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    private ErrorDetails getErrorDetails(NoSuchElementException e, WebRequest request) {
        return new ErrorDetails(LocalDateTime.now(), e.getMessage(), request.getDescription(false));
    }
}
