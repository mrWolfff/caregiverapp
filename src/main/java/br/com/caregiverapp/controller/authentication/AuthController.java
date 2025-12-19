package br.com.caregiverapp.controller.authentication;

import br.com.caregiverapp.domain.dto.AuthRequest;
import br.com.caregiverapp.domain.dto.AuthResponse;
import br.com.caregiverapp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest request
    ) {
        String token =
                authService.login(request.email(), request.password());

        return ResponseEntity.ok(new AuthResponse(token));
    }
}
