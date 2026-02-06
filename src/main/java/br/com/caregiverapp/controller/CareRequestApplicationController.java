package br.com.caregiverapp.controller;

import br.com.caregiverapp.domain.dto.CareRequestApplicationResponse;
import br.com.caregiverapp.service.CareRequestApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/care-requests")
public class CareRequestApplicationController {

    private final CareRequestApplicationService service;

    public CareRequestApplicationController(
            CareRequestApplicationService service
    ) {
        this.service = service;
    }

    @PostMapping("/{careRequestId}/apply")
    public ResponseEntity<CareRequestApplicationResponse> apply(
            @PathVariable UUID careRequestId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CareRequestApplicationResponse.from(
                        service.apply(careRequestId)
                ));
    }
}
