package br.com.caregiverapp.controller;

import br.com.caregiverapp.service.CareRequestAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/care-requests")
public class CareRequestAssignmentController {

    private final CareRequestAssignmentService service;

    public CareRequestAssignmentController(
            CareRequestAssignmentService service
    ) {
        this.service = service;
    }

    @PostMapping("/{careRequestId}/accept/{caregiverProfileId}")
    public ResponseEntity<Void> acceptCaregiver(
            @PathVariable UUID careRequestId,
            @PathVariable UUID caregiverProfileId
    ) {
        service.acceptCaregiver(careRequestId, caregiverProfileId);
        return ResponseEntity.noContent().build();
    }
}
