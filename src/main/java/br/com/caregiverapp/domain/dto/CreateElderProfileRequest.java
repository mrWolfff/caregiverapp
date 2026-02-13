package br.com.caregiverapp.domain.dto;

public record CreateElderProfileRequest(
        String firstName,
        String lastName,
        String phone,
        String emergencyContact,
        String emergencyPhone,
        String address,
        String city,
        String state
) {}
