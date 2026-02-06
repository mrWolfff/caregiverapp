package br.com.caregiverapp.repository;

import br.com.caregiverapp.domain.model.CareRequestApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CareRequestApplicationRepository
        extends JpaRepository<CareRequestApplication, UUID> {

    boolean existsByCareRequestIdAndCaregiverProfileId(
            UUID careRequestId,
            UUID caregiverProfileId
    );

    List<CareRequestApplication> findByCareRequestId(UUID careRequestId);

    List<CareRequestApplication> findByCaregiverProfileId(UUID caregiverProfileId);
}
