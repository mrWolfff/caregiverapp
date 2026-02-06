package br.com.caregiverapp.service;

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

    public String login(String email, String password) {
        Authentication auth =
                new UsernamePasswordAuthenticationToken(email, password);

        authenticationManager.authenticate(auth);

        return jwtService.generateToken(email);
    }

    public void register(
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
    }
}