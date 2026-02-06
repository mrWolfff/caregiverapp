package br.com.caregiverapp.controller;

import br.com.caregiverapp.domain.dto.CaregiverProfileResponse;
import br.com.caregiverapp.domain.dto.CreateCaregiverProfileRequest;
import br.com.caregiverapp.domain.model.CaregiverProfile;
import br.com.caregiverapp.service.CaregiverProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/caregiver/profile")
public class CaregiverProfileController {

    private final CaregiverProfileService service;

    public CaregiverProfileController(CaregiverProfileService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CaregiverProfileResponse> create(
            @RequestBody CreateCaregiverProfileRequest request
    ) {
        CaregiverProfile profile = service.createProfile(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CaregiverProfileResponse.from(profile));
    }
}
