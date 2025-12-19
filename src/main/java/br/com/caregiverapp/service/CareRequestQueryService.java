package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.model.CareRequestApplication;
import br.com.caregiverapp.repository.CareRequestApplicationRepository;
import br.com.caregiverapp.repository.CareRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CareRequestQueryService {

    private final CareRequestApplicationRepository applicationRepository;
    private final CareRequestRepository careRequestRepository;

    public CareRequestQueryService(
            CareRequestApplicationRepository applicationRepository,
            CareRequestRepository careRequestRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.careRequestRepository = careRequestRepository;
    }

    @Transactional(readOnly = true)
    public List<CareRequestApplication> listApplicants(UUID careRequestId) {

        if (!careRequestRepository.existsById(careRequestId)) {
            throw new IllegalArgumentException("Care request not found");
        }

        return applicationRepository.findByCareRequestId(careRequestId);
    }
}
