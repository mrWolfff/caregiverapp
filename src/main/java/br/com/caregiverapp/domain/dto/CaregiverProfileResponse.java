package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.CaregiverProfile;

import java.util.List;
import java.util.UUID;

public record CaregiverProfileResponse(
        UUID id,
        UUID userId,
        String bio,
        Integer yearsOfExperience,
        String hourlyRate,
        String availableFrom,
        String availableTo,
        String city,
        String state,
        List<String> skills
) {
    public static CaregiverProfileResponse from(CaregiverProfile profile) {
        return new CaregiverProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getBio(),
                profile.getYearsOfExperience(),
                profile.getHourlyRate() != null ? profile.getHourlyRate().toString() : null,
                profile.getAvailableFrom() != null ? profile.getAvailableFrom().toString() : null,
                profile.getAvailableTo() != null ? profile.getAvailableTo().toString() : null,
                profile.getCity(),
                profile.getState(),
                profile.getSkillsAsList()
        );
    }
}
