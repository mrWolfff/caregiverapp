package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.model.*;
import br.com.caregiverapp.repository.CareRequestApplicationRepository;
import br.com.caregiverapp.repository.CareRequestRepository;
import br.com.caregiverapp.repository.CaregiverProfileRepository;
import br.com.caregiverapp.security.AuthenticatedUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CareRequestApplicationService {

    private final CareRequestApplicationRepository applicationRepository;
    private final CareRequestRepository careRequestRepository;
    private final CaregiverProfileRepository caregiverProfileRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public CareRequestApplicationService(
            CareRequestApplicationRepository applicationRepository,
            CareRequestRepository careRequestRepository,
            CaregiverProfileRepository caregiverProfileRepository,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.applicationRepository = applicationRepository;
        this.careRequestRepository = careRequestRepository;
        this.caregiverProfileRepository = caregiverProfileRepository;
        this.authenticatedUserService = authenticatedUserService;
    }


    @Transactional
    public CareRequestApplication apply(UUID careRequestId) {

        User user = authenticatedUserService.getCurrentUser();

        CaregiverProfile caregiverProfile =
                caregiverProfileRepository.findByUserId(user.getId())
                        .orElseThrow(() -> new IllegalStateException("Caregiver profile not found"));

        CareRequest careRequest = careRequestRepository.findById(careRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Care request not found"));

        if (careRequest.getStatus() != CareRequestStatus.OPEN) {
            throw new IllegalStateException("Care request is not open");
        }

        if (applicationRepository.existsByCareRequestIdAndCaregiverProfileId(
                careRequestId, caregiverProfile.getId()
        )) {
            throw new IllegalStateException("Already applied");
        }

        return applicationRepository.save(
                new CareRequestApplication(careRequest, caregiverProfile)
        );
    }

}
