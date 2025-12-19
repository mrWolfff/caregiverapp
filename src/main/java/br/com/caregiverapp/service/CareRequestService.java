package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.dto.CreateCareRequestRequest;
import br.com.caregiverapp.domain.model.*;
import br.com.caregiverapp.repository.CareRequestRepository;
import br.com.caregiverapp.repository.ElderProfileRepository;
import br.com.caregiverapp.security.AuthenticatedUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

        ElderProfile elderProfile = elderProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Elder profile not found"));

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
        return careRequestRepository.findByCityAndStateAndStatus(
                city, state, CareRequestStatus.OPEN
        );
    }
}
