package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.dto.CreateElderProfileRequest;
import br.com.caregiverapp.domain.model.ElderProfile;
import br.com.caregiverapp.domain.model.User;
import br.com.caregiverapp.domain.model.UserRole;
import br.com.caregiverapp.repository.ElderProfileRepository;
import br.com.caregiverapp.security.AuthenticatedUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ElderProfileService {

    private final ElderProfileRepository profileRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public ElderProfileService(
            ElderProfileRepository profileRepository,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.profileRepository = profileRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public ElderProfile createProfile(CreateElderProfileRequest req) {

        User user = authenticatedUserService.getCurrentUser();

        if (user.getRole() != UserRole.ELDER) {
            throw new IllegalStateException("Only elders can create profile");
        }

        if (profileRepository.existsByUserId(user.getId())) {
            throw new IllegalStateException("Profile already exists");
        }

        ElderProfile profile = new ElderProfile(
                user,
                req.bio(),
                req.careNeeds(),
                req.medicalConditions(),
                req.mobilityLevel(),
                req.city(),
                req.state()
        );

        return profileRepository.save(profile);
    }
}
