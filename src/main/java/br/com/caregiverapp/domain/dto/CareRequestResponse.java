package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.CareRequest;

import java.util.UUID;

public record CareRequestResponse(
        UUID id,
        UUID elderProfileId,
        String description,
        String careDate,
        String startTime,
        String endTime,
        String city,
        String state,
        String status
) {
    public static CareRequestResponse from(CareRequest careRequest) {
        return new CareRequestResponse(
                careRequest.getId(),
                careRequest.getElderProfile().getId(),
                careRequest.getDescription(),
                careRequest.getCareDate().toString(),
                careRequest.getStartTime().toString(),
                careRequest.getEndTime().toString(),
                careRequest.getCity(),
                careRequest.getState(),
                careRequest.getStatus().name()
        );
    }
}
