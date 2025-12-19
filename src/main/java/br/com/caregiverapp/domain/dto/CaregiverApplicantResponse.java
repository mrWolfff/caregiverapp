package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.CareRequestApplication;

import java.math.BigDecimal;
import java.util.UUID;

public record CaregiverApplicantResponse(
        UUID caregiverProfileId,
        UUID userId,
        String fullName,
        Integer yearsOfExperience,
        BigDecimal hourlyRate,
        String city,
        String state,
        String skills,
        String appliedAt
) {
    public static CaregiverApplicantResponse from(
            CareRequestApplication application
    ) {
        var caregiver = application.getCaregiverProfile();
        var user = caregiver.getUser();

        return new CaregiverApplicantResponse(
                caregiver.getId(),
                user.getId(),
                user.getFullName(),
                caregiver.getYearsOfExperience(),
                caregiver.getHourlyRate(),
                caregiver.getCity(),
                caregiver.getState(),
                caregiver.getSkills(),
                application.getCreatedAt().toString()
        );
    }
}
