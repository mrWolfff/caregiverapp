package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.dto.CreateCareRequestRequest;
import br.com.caregiverapp.domain.model.*;
import br.com.caregiverapp.exception.ProfileNotFoundException;
import br.com.caregiverapp.exception.ResourceNotFoundException;
import br.com.caregiverapp.repository.CareRequestRepository;
import br.com.caregiverapp.repository.ElderProfileRepository;
import br.com.caregiverapp.security.AuthenticatedUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CareRequestService {

    private final CareRequestRepository careRequestRepository;
    private final ElderProfileRepository elderProfileRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public CareRequestService(
            CareRequestRepository careRequestRepository,
            ElderProfileRepository elderProfileRepository,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.careRequestRepository = careRequestRepository;
        this.elderProfileRepository = elderProfileRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public CareRequest create(CreateCareRequestRequest req) {

        User user = authenticatedUserService.getCurrentUser();

        ElderProfile elderProfile = elderProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new ProfileNotFoundException(
                                "You must create an elder profile first"
                        )
                );


        CareRequest request = new CareRequest(
                elderProfile,
                req.description(),
                req.careDate(),
                req.startTime(),
                req.endTime(),
                req.city(),
                req.state()
        );

        return careRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public List<CareRequest> listOpenByLocation(String city, String state) {
        if (city != null && state != null) {
            return careRequestRepository.findByCityAndStateAndStatus(
                    city, state, CareRequestStatus.OPEN
            );
        } else if (city != null) {
            return careRequestRepository.findByCityAndStatus(city, CareRequestStatus.OPEN);
        } else if (state != null) {
            return careRequestRepository.findByStateAndStatus(state, CareRequestStatus.OPEN);
        } else {
            return careRequestRepository.findByStatus(CareRequestStatus.OPEN);
        }
    }

    public CareRequest getById(UUID id) {

        return careRequestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Care request not found")
                );
    }
}
