package com.ventasimple.panel.controller;

import com.ventasimple.panel.model.PanelAdmin;
import com.ventasimple.panel.repository.PanelAdminRepository;
import com.ventasimple.panel.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PanelAdminRepository adminRepo;
    private final PasswordEncoder      encoder;
    private final JwtUtil              jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String pass  = body.get("password");

        PanelAdmin admin = adminRepo.findByEmail(email).orElse(null);
        if (admin == null || !admin.getActivo() || !encoder.matches(pass, admin.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Credenciales incorrectas."));
        }

        String token = jwtUtil.generate(admin.getEmail(), admin.getRol());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "nombre", admin.getNombre(),
            "rol",   admin.getRol()
        ));
    }
}
