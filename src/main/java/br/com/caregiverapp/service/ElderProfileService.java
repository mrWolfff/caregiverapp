package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.dto.CareRequestResponse;
import br.com.caregiverapp.domain.dto.CreateElderProfileRequest;
import br.com.caregiverapp.domain.dto.UpdateElderProfileRequest;
import br.com.caregiverapp.domain.model.CareRequest;
import br.com.caregiverapp.domain.model.ElderProfile;
import br.com.caregiverapp.domain.model.User;
import br.com.caregiverapp.exception.ProfileNotFoundException;
import br.com.caregiverapp.repository.CareRequestRepository;
import br.com.caregiverapp.repository.ElderProfileRepository;
import br.com.caregiverapp.security.AuthenticatedUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElderProfileService {

    private final ElderProfileRepository repository;
    private final AuthenticatedUserService authenticatedUserService;
    private final CareRequestRepository careRequestRepository;

    public ElderProfileService(
            ElderProfileRepository repository,
            AuthenticatedUserService authenticatedUserService, CareRequestRepository careRequestRepository
    ) {
        this.repository = repository;
        this.authenticatedUserService = authenticatedUserService;
        this.careRequestRepository = careRequestRepository;
    }

    public ElderProfile getProfile() {
        User user = authenticatedUserService.getCurrentUser();

        return repository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ProfileNotFoundException("Elder profile not found")
                );
    }

    public ElderProfile create(CreateElderProfileRequest request) {

        User user = authenticatedUserService.getCurrentUser();

        ElderProfile profile = new ElderProfile(
                user,
                request.phone(),
                request.emergencyContact(),
                request.emergencyPhone(),
                request.address(),
                request.city(),
                request.state()
        );

        return repository.save(profile);
    }

    public ElderProfile update(UpdateElderProfileRequest request) {

        User user = authenticatedUserService.getCurrentUser();

        ElderProfile profile = repository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ProfileNotFoundException("Elder profile not found")
                );

        if (request.phone() != null) {
            profile.setPhone(request.phone());
        }

        if (request.emergencyContact() != null) {
            profile.setEmergencyContact(request.emergencyContact());
        }

        if (request.emergencyPhone() != null) {
            profile.setEmergencyPhone(request.emergencyPhone());
        }

        if (request.address() != null) {
            profile.setAddress(request.address());
        }

        if (request.city() != null) {
            profile.setCity(request.city());
        }

        if (request.state() != null) {
            profile.setState(request.state());
        }

        return repository.save(profile);
    }

    public List<CareRequestResponse> getMyRequests() {
        User user = authenticatedUserService.getCurrentUser();

        ElderProfile profile = repository
                .findByUserId(user.getId())
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found"));



        return careRequestRepository.findByElderProfileId(profile.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CareRequestResponse toResponse(CareRequest entity) {
        return new CareRequestResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus(),
                entity.getCreatedAt()
                //ajustar aqui
        );
    }


}
