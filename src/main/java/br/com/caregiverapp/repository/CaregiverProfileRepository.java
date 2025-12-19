package br.com.caregiverapp.repository;

import br.com.caregiverapp.domain.model.CaregiverProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CaregiverProfileRepository
        extends JpaRepository<CaregiverProfile, UUID> {

    Optional<CaregiverProfile> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}