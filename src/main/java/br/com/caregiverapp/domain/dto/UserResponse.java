package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.UserRole;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        UserRole role
) {}