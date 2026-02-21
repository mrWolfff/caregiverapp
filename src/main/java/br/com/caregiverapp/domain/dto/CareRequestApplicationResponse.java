package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.CareRequestApplication;

import java.math.BigDecimal;
import java.util.UUID;

public record CareRequestApplicationResponse(
        UUID id,
        UUID careRequestId,
        UUID caregiverProfileId,
        String caregiverName,
        String caregiverBio,
        Integer yearsOfExperience,
        BigDecimal hourlyRate,
        String status,
        String message,
        String appliedAt
) {
    public static CareRequestApplicationResponse from(
            CareRequestApplication application
    ) {
        var caregiver = application.getCaregiverProfile();
        var request = application.getCareRequest();
        
        String status = "PENDING";
        if (request.getAssignedCaregiver() != null && 
            request.getAssignedCaregiver().getId().equals(caregiver.getId())) {
            status = "ACCEPTED";
        }

        return new CareRequestApplicationResponse(
                application.getId(),
                request.getId(),
                caregiver.getId(),
                caregiver.getUser().getFullName(),
                caregiver.getBio(),
                caregiver.getYearsOfExperience(),
                caregiver.getHourlyRate(),
                status,
                application.getMessage(),
                application.getCreatedAt().toString()
        );
    }
}
