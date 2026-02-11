package br.com.caregiverapp.service;

import br.com.caregiverapp.domain.dto.AuthResponse;
import br.com.caregiverapp.domain.dto.UserResponse;
import br.com.caregiverapp.domain.model.User;
import br.com.caregiverapp.domain.model.UserRole;
import br.com.caregiverapp.repository.UserRepository;
import br.com.caregiverapp.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(String email, String password) {

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(email, password);

        authenticationManager.authenticate(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        String token = jwtService.generateToken(email);

        return new AuthResponse(
                token,
                new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getRole()
                )
        );
    }


    public AuthResponse register(
            String firstName,
            String lastName,
            String email,
            String password,
            UserRole role
    ) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        String passwordHash = passwordEncoder.encode(password);
        String fullName = firstName + " " + lastName;
        User user = new User(
                fullName,
                email,
                passwordHash,
                role
        );

        userRepository.save(user);
        String token = jwtService.generateToken(email);

        return new AuthResponse(
                token,
                new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getRole()
                )
        );
    }
}