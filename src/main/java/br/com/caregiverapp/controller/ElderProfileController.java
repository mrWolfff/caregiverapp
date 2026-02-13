package br.com.caregiverapp.controller;

import br.com.caregiverapp.domain.dto.CareRequestResponse;
import br.com.caregiverapp.domain.dto.CreateElderProfileRequest;
import br.com.caregiverapp.domain.dto.ElderProfileResponse;
import br.com.caregiverapp.domain.dto.UpdateElderProfileRequest;
import br.com.caregiverapp.domain.model.CareRequest;
import br.com.caregiverapp.service.ElderProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elder")
public class ElderProfileController {

    private final ElderProfileService service;

    public ElderProfileController(ElderProfileService service) {
        this.service = service;
    }

    @GetMapping("/profile")
    public ResponseEntity<ElderProfileResponse> get() {
        return ResponseEntity.ok(
                ElderProfileResponse.from(service.getProfile())
        );
    }

    @PostMapping("/profile")
    public ResponseEntity<ElderProfileResponse> create(
            @RequestBody CreateElderProfileRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ElderProfileResponse.from(service.create(request)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ElderProfileResponse> update(
            @RequestBody UpdateElderProfileRequest request
    ) {
        return ResponseEntity.ok(
                ElderProfileResponse.from(service.update(request))
        );
    }

    @GetMapping("/care-requests")
    public List<CareRequestResponse> getMyRequests() {
        return service.getMyRequests();
    }
}
