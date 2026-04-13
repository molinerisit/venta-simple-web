package com.ventasimple.panel.controller;

import com.ventasimple.panel.model.*;
import com.ventasimple.panel.repository.*;
import com.ventasimple.panel.service.InstalacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class InstalacionController {

    private final InstalacionService    service;
    private final HeartbeatLogRepository heartbeatRepo;
    private final LicenciaRepository    licenciaRepo;

    // ════════════════════════════════════════════════════════
    // RUTAS PARA EL PANEL WEB (requieren JWT)
    // ════════════════════════════════════════════════════════

    @GetMapping("/api/panel/instalaciones")
    public List<Map<String, Object>> listar() {
        return service.listarTodas().stream().map(this::toSummary).toList();
    }

    @GetMapping("/api/panel/instalaciones/{id}")
    public ResponseEntity<?> obtener(@PathVariable UUID id) {
        try { return ResponseEntity.ok(service.buscarPorId(id)); }
        catch (NoSuchElementException e) { return ResponseEntity.notFound().build(); }
    }

    @PostMapping("/api/panel/instalaciones")
    public ResponseEntity<?> crear(@RequestBody Map<String, String> body) {
        String nombre = body.get("nombreNegocio");
        String email  = body.get("emailContacto");
        String plan   = body.getOrDefault("plan", "FREE");
        Instalacion inst = service.crear(nombre, email, Instalacion.Plan.valueOf(plan));
        return ResponseEntity.status(HttpStatus.CREATED).body(toSummary(inst));
    }

    @GetMapping("/api/panel/instalaciones/{id}/features")
    public Map<String, Boolean> features(@PathVariable UUID id) {
        return service.getFeatures(id);
    }

    @PutMapping("/api/panel/instalaciones/{id}/features/{nombre}")
    public ResponseEntity<?> setFeature(@PathVariable UUID id,
                                         @PathVariable String nombre,
                                         @RequestBody Map<String, Boolean> body) {
        service.setFeature(id, nombre, Boolean.TRUE.equals(body.get("habilitado")));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/api/panel/instalaciones/{id}/comandos")
    public ResponseEntity<?> enviarComando(@PathVariable UUID id,
                                            @RequestBody Map<String, String> body) {
        ComandoRemoto cmd = service.enviarComando(
            id,
            ComandoRemoto.Tipo.valueOf(body.getOrDefault("tipo","CMD")),
            body.get("payload")
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", cmd.getId()));
    }

    @PostMapping("/api/panel/instalaciones/{id}/suscripcion")
    public ResponseEntity<?> suscribir(@PathVariable UUID id,
                                        @RequestBody Map<String, Object> body) {
        String plan  = (String) body.get("plan");
        int    dias  = body.containsKey("dias") ? (int) body.get("dias") : 365;
        Instant inicio = Instant.now();
        Instant fin    = inicio.plus(dias, ChronoUnit.DAYS);
        Suscripcion s = service.crearSuscripcion(id, Instalacion.Plan.valueOf(plan), inicio, fin);
        return ResponseEntity.ok(Map.of("id", s.getId(), "finAt", s.getFinAt()));
    }

    @GetMapping("/api/panel/instalaciones/{id}/heartbeats")
    public List<HeartbeatLog> heartbeats(@PathVariable UUID id) {
        return heartbeatRepo.findTop50ByInstalacionIdOrderByTimestampDesc(id);
    }

    @GetMapping("/api/panel/stats")
    public Map<String, Object> stats() {
        return service.getStats();
    }

    // ── Licencias ─────────────────────────────────────────────
    @GetMapping("/api/panel/licencias")
    public List<Licencia> listarLicencias() { return licenciaRepo.findAll(); }

    @PostMapping("/api/panel/licencias")
    public ResponseEntity<?> generarLicencia(@RequestBody Map<String, String> body) {
        String plan  = body.getOrDefault("plan","PRO");
        String clave = generarClave();
        Licencia lic = licenciaRepo.save(Licencia.builder()
            .clave(clave)
            .plan(Instalacion.Plan.valueOf(plan))
            .estado(Licencia.Estado.DISPONIBLE)
            .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(lic);
    }

    // ════════════════════════════════════════════════════════
    // RUTAS PARA VENTASIMPLE (install token, no JWT)
    // ════════════════════════════════════════════════════════

    /** VentaSimple llama esto cada 5 minutos */
    @PostMapping("/api/install/heartbeat")
    public ResponseEntity<?> heartbeat(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody Map<String, Object> body,
                                        jakarta.servlet.http.HttpServletRequest req) {
        String token = extractToken(authHeader);
        try {
            String ip      = req.getRemoteAddr();
            String version = (String) body.get("version");
            String metrics = body.containsKey("metrics")
                ? body.get("metrics").toString() : null;
            Map<String, Object> resp = service.procesarHeartbeat(token, ip, version, metrics);
            return ResponseEntity.ok(resp);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    /** VentaSimple confirma que ejecutó un comando */
    @PostMapping("/api/install/comandos/{cmdId}/resultado")
    public ResponseEntity<?> resultadoComando(@RequestHeader("Authorization") String authHeader,
                                               @PathVariable UUID cmdId,
                                               @RequestBody Map<String, Object> body) {
        String token = extractToken(authHeader);
        // Verificar que el token sea válido
        service.buscarPorToken(token)
            .orElseThrow(() -> new SecurityException("Token inválido."));
        boolean exito = Boolean.TRUE.equals(body.get("success"));
        String result = (String) body.getOrDefault("output","");
        service.confirmarComando(cmdId, exito, result);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    /** VentaSimple activa su licencia */
    @PostMapping("/api/install/activar")
    public ResponseEntity<?> activarLicencia(@RequestBody Map<String, String> body) {
        String clave  = body.get("clave");
        String nombre = body.get("nombreNegocio");
        String email  = body.get("email");

        Licencia lic = licenciaRepo.findByClave(clave).orElse(null);
        if (lic == null || lic.getEstado() != Licencia.Estado.DISPONIBLE) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error","Licencia inválida o ya utilizada."));
        }

        Instalacion inst = service.crear(nombre, email, lic.getPlan());
        lic.setEstado(Licencia.Estado.ACTIVA);
        lic.setActivadaAt(Instant.now());
        lic.setInstalacion(inst);
        if (lic.getExpiraAt() != null) inst.setPlanExpiresAt(lic.getExpiraAt());
        licenciaRepo.save(lic);

        return ResponseEntity.ok(Map.of(
            "installToken", inst.getInstallToken(),
            "installId",    inst.getId(),
            "plan",         inst.getPlan()
        ));
    }

    // ── Helpers ───────────────────────────────────────────────
    private String extractToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) throw new SecurityException("Sin token.");
        return header.substring(7).trim();
    }

    private Map<String, Object> toSummary(Instalacion i) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",            i.getId());
        m.put("nombreNegocio", i.getNombreNegocio());
        m.put("emailContacto", i.getEmailContacto());
        m.put("plan",          i.getPlan());
        m.put("planExpiresAt", i.getPlanExpiresAt());
        m.put("lastSeenAt",    i.getLastSeenAt());
        m.put("online",        i.isOnline(10));
        m.put("versionApp",    i.getVersionApp());
        m.put("ipAddress",     i.getIpAddress());
        m.put("activa",        i.getActiva());
        return m;
    }

    private String generarClave() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder();
        for (int g = 0; g < 4; g++) {
            if (g > 0) sb.append('-');
            for (int c = 0; c < 4; c++) sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
