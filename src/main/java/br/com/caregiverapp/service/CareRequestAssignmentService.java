package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.model.*;
import br.com.caregiverapp.repository.*;
import br.com.caregiverapp.security.AuthenticatedUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CareRequestAssignmentService {

    private final CareRequestRepository careRequestRepository;
    private final CareRequestApplicationRepository applicationRepository;
    private final CaregiverProfileRepository caregiverProfileRepository;
    private final ElderProfileRepository elderProfileRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public CareRequestAssignmentService(
            CareRequestRepository careRequestRepository,
            CareRequestApplicationRepository applicationRepository,
            CaregiverProfileRepository caregiverProfileRepository,
            ElderProfileRepository elderProfileRepository,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.careRequestRepository = careRequestRepository;
        this.applicationRepository = applicationRepository;
        this.caregiverProfileRepository = caregiverProfileRepository;
        this.elderProfileRepository = elderProfileRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public void acceptApplication(UUID careRequestId, UUID applicationId) {

        User user = authenticatedUserService.getCurrentUser();

        ElderProfile elderProfile = elderProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Elder profile not found"));

        CareRequest careRequest = careRequestRepository.findById(careRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Care request not found"));

        if (!careRequest.getElderProfile().getId().equals(elderProfile.getId())) {
            throw new IllegalStateException("You do not own this care request");
        }

        if (careRequest.getStatus() != CareRequestStatus.OPEN) {
            throw new IllegalStateException("Care request is not open");
        }

        CareRequestApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (!application.getCareRequest().getId().equals(careRequestId)) {
            throw new IllegalStateException("Application does not belong to this care request");
        }

        careRequest.assignCaregiver(application.getCaregiverProfile());

        careRequestRepository.save(careRequest);
    }
}
