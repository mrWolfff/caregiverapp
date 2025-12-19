package br.com.caregiverapp.controller;

import br.com.caregiverapp.domain.dto.CaregiverApplicantResponse;
import br.com.caregiverapp.service.CareRequestQueryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/care-requests")
public class CareRequestQueryController {

    private final CareRequestQueryService service;

    public CareRequestQueryController(CareRequestQueryService service) {
        this.service = service;
    }

    @GetMapping("/{careRequestId}/applicants")
    public List<CaregiverApplicantResponse> listApplicants(
            @PathVariable UUID careRequestId
    ) {
        return service.listApplicants(careRequestId)
                .stream()
                .map(CaregiverApplicantResponse::from)
                .toList();
    }
}
