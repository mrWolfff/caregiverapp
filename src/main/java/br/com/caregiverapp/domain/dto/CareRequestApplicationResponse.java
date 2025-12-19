package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.CareRequestApplication;

import java.util.UUID;

public record CareRequestApplicationResponse(
        UUID id,
        UUID careRequestId,
        UUID caregiverProfileId,
        String appliedAt
) {
    public static CareRequestApplicationResponse from(
            CareRequestApplication application
    ) {
        return new CareRequestApplicationResponse(
                application.getId(),
                application.getCareRequest().getId(),
                application.getCaregiverProfile().getId(),
                application.getCreatedAt().toString()
        );
    }
}
