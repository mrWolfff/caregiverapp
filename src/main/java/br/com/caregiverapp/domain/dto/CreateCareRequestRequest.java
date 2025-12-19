package br.com.caregiverapp.domain.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateCareRequestRequest(
        String description,
        LocalDate careDate,
        LocalTime startTime,
        LocalTime endTime,
        String city,
        String state
) {}
