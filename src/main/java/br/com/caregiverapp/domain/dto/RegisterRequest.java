package br.com.caregiverapp.domain.dto;

import br.com.caregiverapp.domain.model.UserRole;

public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        UserRole role
) {}
