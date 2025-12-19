package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.ElderProfile;

import java.util.UUID;

public record ElderProfileResponse(
        UUID id,
        UUID userId,
        String bio,
        String careNeeds,
        String medicalConditions,
        String mobilityLevel,
        String city,
        String state
) {
    public static ElderProfileResponse from(ElderProfile profile) {
        return new ElderProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getBio(),
                profile.getCareNeeds(),
                profile.getMedicalConditions(),
                profile.getMobilityLevel(),
                profile.getCity(),
                profile.getState()
        );
    }
}
