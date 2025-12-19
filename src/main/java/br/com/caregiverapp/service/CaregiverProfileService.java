package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.dto.CreateCaregiverProfileRequest;
import br.com.caregiverapp.domain.model.*;
import br.com.caregiverapp.repository.CaregiverProfileRepository;
import br.com.caregiverapp.security.AuthenticatedUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CaregiverProfileService {

    private final CaregiverProfileRepository profileRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public CaregiverProfileService(
            CaregiverProfileRepository profileRepository,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.profileRepository = profileRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public CaregiverProfile createProfile(CreateCaregiverProfileRequest req) {

        User user = authenticatedUserService.getCurrentUser();

        if (user.getRole() != UserRole.CAREGIVER) {
            throw new IllegalStateException("Only caregivers can create profile");
        }

        if (profileRepository.existsByUserId(user.getId())) {
            throw new IllegalStateException("Profile already exists");
        }

        CaregiverProfile profile = new CaregiverProfile(
                user,
                req.bio(),
                req.yearsOfExperience(),
                req.hourlyRate(),
                req.availableFrom(),
                req.availableTo(),
                req.city(),
                req.state(),
                req.skills()
        );

        return profileRepository.save(profile);
    }
}
