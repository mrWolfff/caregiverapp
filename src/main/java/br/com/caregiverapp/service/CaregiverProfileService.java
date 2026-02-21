package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.dto.CreateCaregiverProfileRequest;
import br.com.caregiverapp.domain.dto.UpdateCaregiverProfileRequest;
import br.com.caregiverapp.domain.model.*;
import br.com.caregiverapp.repository.CareRequestApplicationRepository;
import br.com.caregiverapp.repository.CaregiverProfileRepository;
import br.com.caregiverapp.security.AuthenticatedUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CaregiverProfileService {

    private final CaregiverProfileRepository profileRepository;
    private final CareRequestApplicationRepository applicationRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public CaregiverProfileService(
            CaregiverProfileRepository profileRepository,
            CareRequestApplicationRepository applicationRepository,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.profileRepository = profileRepository;
        this.applicationRepository = applicationRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional(readOnly = true)
    public CaregiverProfile getProfile() {
        User user = authenticatedUserService.getCurrentUser();
        return profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Caregiver profile not found"));
    }

    @Transactional
    public CaregiverProfile updateProfile(UpdateCaregiverProfileRequest req) {
        CaregiverProfile profile = getProfile();

        profile.setBio(req.bio());
        profile.setYearsOfExperience(req.yearsOfExperience());
        profile.setHourlyRate(req.hourlyRate());
        profile.setAvailableFrom(req.availableFrom());
        profile.setAvailableTo(req.availableTo());
        profile.setCity(req.city());
        profile.setState(req.state());
        profile.setSkillsFromList(req.skills());

        return profileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public List<CareRequestApplication> listApplications() {
        CaregiverProfile profile = getProfile();
        return applicationRepository.findByCaregiverProfileId(profile.getId());
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
