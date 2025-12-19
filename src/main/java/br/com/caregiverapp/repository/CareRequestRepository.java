package br.com.caregiverapp.repository;

import br.com.caregiverapp.domain.model.CareRequest;
import br.com.caregiverapp.domain.model.CareRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CareRequestRepository
        extends JpaRepository<CareRequest, UUID> {

    List<CareRequest> findByCityAndStateAndStatus(
            String city,
            String state,
            CareRequestStatus status
    );

    List<CareRequest> findByElderProfileId(UUID elderProfileId);
}
