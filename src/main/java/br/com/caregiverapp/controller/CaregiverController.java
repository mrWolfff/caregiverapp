package br.com.caregiverapp.controller;

import br.com.caregiverapp.domain.dto.CareRequestApplicationResponse;
import br.com.caregiverapp.domain.dto.CaregiverProfileResponse;
import br.com.caregiverapp.domain.dto.UpdateCaregiverProfileRequest;
import br.com.caregiverapp.service.CaregiverProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/caregiver")
public class CaregiverController {

    private final CaregiverProfileService service;

    public CaregiverController(CaregiverProfileService service) {
        this.service = service;
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
