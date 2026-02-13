package br.com.caregiverapp.domain.dto;


import jakarta.validation.constraints.Size;

public record UpdateElderProfileRequest(

        @Size(max = 20)
        String phone,

        @Size(max = 100)
        String emergencyContact,

        @Size(max = 20)
        String emergencyPhone,

        @Size(max = 255)
        String address,

        @Size(max = 100)
        String city,

        @Size(max = 2)
        String state
) {}