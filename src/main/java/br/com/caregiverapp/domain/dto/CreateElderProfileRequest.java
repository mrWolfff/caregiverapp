package br.com.caregiverapp.domain.dto;

public record CreateElderProfileRequest(
        String bio,
        String careNeeds,
        String medicalConditions,
        String mobilityLevel,
        String city,
        String state
) {}
