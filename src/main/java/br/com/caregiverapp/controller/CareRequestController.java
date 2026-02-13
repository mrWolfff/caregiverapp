package br.com.caregiverapp.controller;

import br.com.caregiverapp.domain.dto.CareRequestResponse;
import br.com.caregiverapp.domain.dto.CreateCareRequestRequest;
import br.com.caregiverapp.domain.model.CareRequest;
import br.com.caregiverapp.service.CareRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/care-requests")
public class CareRequestController {

    private final CareRequestService service;

    public CareRequestController(CareRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CareRequestResponse> create(
            @RequestBody CreateCareRequestRequest request
    ) {
        CareRequest careRequest = service.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CareRequestResponse.from(careRequest));
    }

    @GetMapping
    public List<CareRequestResponse> listOpen(
            @RequestParam String city,
            @RequestParam String state
    ) {
        return service.listOpenByLocation(city, state)
                .stream()
                .map(CareRequestResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CareRequestResponse> getById(
            @PathVariable UUID id
    ) {
        CareRequest careRequest = service.getById(id);

        return ResponseEntity.ok(
                CareRequestResponse.from(careRequest)
        );
    }
}
