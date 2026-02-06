package br.com.caregiverapp.repository;

import br.com.caregiverapp.domain.model.ElderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ElderProfileRepository
        extends JpaRepository<ElderProfile, UUID> {

    Optional<ElderProfile> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}
