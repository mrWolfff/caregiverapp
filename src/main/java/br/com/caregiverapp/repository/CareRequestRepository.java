package br.com.caregiverapp.repository;

import br.com.caregiverapp.domain.model.CareRequest;
import br.com.caregiverapp.domain.model.CareRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CareRequestRepository
        extends JpaRepository<CareRequest, UUID> {

    List<CareRequest> findByCityAndStateAndStatus(
            String city,
            String state,
            CareRequestStatus status
    );

    List<CareRequest> findByCityAndStatus(String city, CareRequestStatus status);

    List<CareRequest> findByStateAndStatus(String state, CareRequestStatus status);

    List<CareRequest> findByStatus(CareRequestStatus status);

    List<CareRequest> findByElderProfileId(UUID elderProfileId);
}
