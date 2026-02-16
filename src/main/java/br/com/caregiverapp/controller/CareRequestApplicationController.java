package br.com.caregiverapp.controller;

import br.com.caregiverapp.domain.dto.ApplyRequest;
import br.com.caregiverapp.domain.dto.CareRequestApplicationResponse;
import br.com.caregiverapp.service.CareRequestApplicationService;
import br.com.caregiverapp.service.CareRequestAssignmentService;
import br.com.caregiverapp.service.CareRequestQueryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/care-requests")
public class CareRequestApplicationController {

    private final CareRequestApplicationService service;
    private final CareRequestQueryService queryService;
    private final CareRequestAssignmentService assignmentService;

    public CareRequestApplicationController(
            CareRequestApplicationService service,
            CareRequestQueryService queryService,
            CareRequestAssignmentService assignmentService
    ) {
        this.service = service;
        this.queryService = queryService;
        this.assignmentService = assignmentService;
    }

    @GetMapping("/{careRequestId}/applications")
    public List<CareRequestApplicationResponse> listApplications(
            @PathVariable UUID careRequestId
    ) {
        return queryService.listApplicants(careRequestId)
                .stream()
                .map(CareRequestApplicationResponse::from)
                .toList();
    }

    @PostMapping("/{careRequestId}/apply")
    public ResponseEntity<CareRequestApplicationResponse> apply(
            @PathVariable UUID careRequestId,
            @RequestBody(required = false) ApplyRequest body
    ) {
        String message = body != null ? body.message() : null;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CareRequestApplicationResponse.from(
                        service.apply(careRequestId, message)
                ));
    }

    @PostMapping("/{careRequestId}/applications/{applicationId}/accept")
    public ResponseEntity<Void> accept(
            @PathVariable UUID careRequestId,
            @PathVariable UUID applicationId
    ) {
        assignmentService.acceptApplication(careRequestId, applicationId);
        return ResponseEntity.noContent().build();
    }
}
