package br.com.caregiverapp.controller;

import br.com.caregiverapp.domain.dto.CareRequestApplicationResponse;
import br.com.caregiverapp.domain.dto.CaregiverProfileResponse;
import br.com.caregiverapp.domain.dto.CreateCaregiverProfileRequest;
import br.com.caregiverapp.domain.dto.UpdateCaregiverProfileRequest;
import br.com.caregiverapp.domain.model.CaregiverProfile;
import br.com.caregiverapp.service.CaregiverProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caregiver")
public class CaregiverProfileController {

    private final CaregiverProfileService service;

    public CaregiverProfileController(CaregiverProfileService service) {
        this.service = service;
    }

    @PostMapping("/profile")
    public ResponseEntity<CaregiverProfileResponse> create( @RequestBody CreateCaregiverProfileRequest request) {
        CaregiverProfile profile = service.createProfile(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(CaregiverProfileResponse.from(profile));
    }
    @GetMapping("/profile")
    public CaregiverProfileResponse getProfile() {
        return CaregiverProfileResponse.from(service.getProfile());
    }

    @PutMapping("/profile")
    public CaregiverProfileResponse updateProfile(@RequestBody UpdateCaregiverProfileRequest request) {
        return CaregiverProfileResponse.from(service.updateProfile(request));
    }

    @GetMapping("/applications")
    public List<CareRequestApplicationResponse> listApplications() {
        return service.listApplications()
                .stream()
                .map(CareRequestApplicationResponse::from)
                .toList();
    }
}
