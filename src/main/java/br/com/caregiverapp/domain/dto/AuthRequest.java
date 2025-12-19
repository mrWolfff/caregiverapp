package br.com.caregiverapp.domain.dto;

public record AuthRequest(
        String email,
        String password
) {}
