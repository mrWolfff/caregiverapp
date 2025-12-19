package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.CaregiverProfile;

import java.util.UUID;

public record CaregiverProfileResponse(
        UUID id,
        UUID userId,
        String bio,
        Integer yearsOfExperience,
        String hourlyRate,
        String city,
        String state,
        String skills
) {
    public static CaregiverProfileResponse from(CaregiverProfile profile) {
        return new CaregiverProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getBio(),
                profile.getYearsOfExperience(),
                profile.getHourlyRate() != null ? profile.getHourlyRate().toString() : null,
                profile.getCity(),
                profile.getState(),
                profile.getSkills()
        );
    }
}
