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
    public void acceptCaregiver(UUID careRequestId, UUID caregiverProfileId) {

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

        boolean applied = applicationRepository
                .existsByCareRequestIdAndCaregiverProfileId(
                        careRequestId, caregiverProfileId
                );

        if (!applied) {
            throw new IllegalStateException("Caregiver did not apply");
        }

        CaregiverProfile caregiverProfile =
                caregiverProfileRepository.findById(caregiverProfileId)
                        .orElseThrow(() -> new IllegalArgumentException("Caregiver not found"));

        careRequest.assignCaregiver(caregiverProfile);

        careRequestRepository.save(careRequest);
    }
}
