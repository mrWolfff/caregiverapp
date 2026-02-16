package br.com.caregiverapp.domain.dto;

import java.math.BigDecimal;
import java.time.LocalTime;

public record UpdateCaregiverProfileRequest(
        String bio,
        Integer yearsOfExperience,
        BigDecimal hourlyRate,
        LocalTime availableFrom,
        LocalTime availableTo,
        String city,
        String state,
        String skills
) {}
