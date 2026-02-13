package br.com.caregiverapp.exception;

import br.com.caregiverapp.domain.dto.ErrorResponse;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProfileNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProfileNotFound(
            ProfileNotFoundException ex
    ) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                ex.getMessage(),
                Instant.now()
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
}
