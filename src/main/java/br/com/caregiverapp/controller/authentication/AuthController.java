package br.com.caregiverapp.controller.authentication;

import br.com.caregiverapp.domain.dto.AuthRequest;
import br.com.caregiverapp.domain.dto.AuthResponse;
import br.com.caregiverapp.domain.dto.RegisterRequest;
import br.com.caregiverapp.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(
                request.firstName(),
                request.lastName(),
                request.email(),
                request.password(),
                request.role()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest request
    ) {
        AuthResponse response =
                authService.login(request.email(), request.password());

        return ResponseEntity.ok(response);
    }
}
