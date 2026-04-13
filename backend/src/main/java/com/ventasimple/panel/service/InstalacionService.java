package com.ventasimple.panel.service;

import com.ventasimple.panel.model.*;
import com.ventasimple.panel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class InstalacionService {

    private final InstalacionRepository     instalacionRepo;
    private final FeatureFlagRepository     featureFlagRepo;
    private final ComandoRemotoRepository   comandoRepo;
    private final HeartbeatLogRepository    heartbeatRepo;
    private final SuscripcionRepository     suscripcionRepo;

    @Value("${app.heartbeat-timeout-minutes:10}")
    private int heartbeatTimeoutMinutes;

    // ── Listar ───────────────────────────────────────────────
    public List<Instalacion> listarTodas() {
        return instalacionRepo.findAll();
    }

    public Instalacion buscarPorId(UUID id) {
        return instalacionRepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Instalación no encontrada: " + id));
    }

    public Optional<Instalacion> buscarPorToken(String token) {
        return instalacionRepo.findByInstallToken(token);
    }

    // ── Crear ────────────────────────────────────────────────
    @Transactional
    public Instalacion crear(String nombreNegocio, String emailContacto, Instalacion.Plan plan) {
        String token = generarToken();
        Instalacion inst = Instalacion.builder()
            .nombreNegocio(nombreNegocio)
            .emailContacto(emailContacto)
            .installToken(token)
            .plan(plan)
            .activa(true)
            .build();
        inst = instalacionRepo.save(inst);

        // Feature flags por defecto según plan
        crearFeaturesDefault(inst);
        return inst;
    }

    // ── Heartbeat (llamado por VentaSimple) ──────────────────
    @Transactional
    public Map<String, Object> procesarHeartbeat(String token, String ip,
                                                  String version, String metricsJson) {
        Instalacion inst = instalacionRepo.findByInstallToken(token)
            .orElseThrow(() -> new SecurityException("Token de instalación inválido."));

        if (!inst.getActiva()) throw new SecurityException("Instalación deshabilitada.");

        // Actualizar last_seen
        inst.setLastSeenAt(Instant.now());
        inst.setIpAddress(ip);
        inst.setVersionApp(version);
        if (metricsJson != null) inst.setLastMetrics(metricsJson);
        instalacionRepo.save(inst);

        // Log heartbeat
        heartbeatRepo.save(HeartbeatLog.builder()
            .instalacion(inst)
            .ipAddress(ip)
            .versionApp(version)
            .metrics(metricsJson)
            .build());

        // Buscar comandos pendientes para devolver
        List<ComandoRemoto> pendientes = comandoRepo
            .findByInstalacionIdAndEstado(inst.getId(), ComandoRemoto.Estado.PENDIENTE);

        // Feature flags actuales
        Map<String, Boolean> features = new HashMap<>();
        featureFlagRepo.findByInstalacionId(inst.getId())
            .forEach(f -> features.put(f.getNombre(), f.getHabilitado()));

        Map<String, Object> resp = new HashMap<>();
        resp.put("installId",  inst.getId());
        resp.put("plan",       inst.getPlan());
        resp.put("features",   features);
        resp.put("planExpires",inst.getPlanExpiresAt());
        resp.put("comandos",   pendientes.stream().map(this::comandoToMap).toList());
        return resp;
    }

    // ── Confirmar ejecución de comando ────────────────────────
    @Transactional
    public void confirmarComando(UUID comandoId, boolean exito, String resultado) {
        ComandoRemoto cmd = comandoRepo.findById(comandoId)
            .orElseThrow(() -> new NoSuchElementException("Comando no encontrado."));
        cmd.setEstado(exito ? ComandoRemoto.Estado.EJECUTADO : ComandoRemoto.Estado.FALLIDO);
        cmd.setResultado(resultado);
        cmd.setEjecutadoAt(Instant.now());
        comandoRepo.save(cmd);
    }

    // ── Feature flags ─────────────────────────────────────────
    @Transactional
    public void setFeature(UUID instalacionId, String nombre, boolean habilitado) {
        Instalacion inst = buscarPorId(instalacionId);
        FeatureFlag flag = featureFlagRepo
            .findByInstalacionIdAndNombre(instalacionId, nombre)
            .orElseGet(() -> FeatureFlag.builder().instalacion(inst).nombre(nombre).build());
        flag.setHabilitado(habilitado);
        featureFlagRepo.save(flag);
    }

    public Map<String, Boolean> getFeatures(UUID instalacionId) {
        Map<String, Boolean> map = new HashMap<>();
        featureFlagRepo.findByInstalacionId(instalacionId)
            .forEach(f -> map.put(f.getNombre(), f.getHabilitado()));
        return map;
    }

    // ── Comandos remotos ──────────────────────────────────────
    @Transactional
    public ComandoRemoto enviarComando(UUID instalacionId, ComandoRemoto.Tipo tipo, String payload) {
        Instalacion inst = buscarPorId(instalacionId);
        ComandoRemoto cmd = ComandoRemoto.builder()
            .instalacion(inst)
            .tipo(tipo)
            .payload(payload)
            .estado(ComandoRemoto.Estado.PENDIENTE)
            .build();
        return comandoRepo.save(cmd);
    }

    // ── Suscripciones ─────────────────────────────────────────
    @Transactional
    public Suscripcion crearSuscripcion(UUID instalacionId, Instalacion.Plan plan,
                                         Instant inicio, Instant fin) {
        Instalacion inst = buscarPorId(instalacionId);
        inst.setPlan(plan);
        inst.setPlanExpiresAt(fin);
        instalacionRepo.save(inst);

        return suscripcionRepo.save(Suscripcion.builder()
            .instalacion(inst)
            .plan(plan)
            .inicioAt(inicio)
            .finAt(fin)
            .estado(Suscripcion.Estado.ACTIVA)
            .build());
    }

    // ── Estadísticas globales ─────────────────────────────────
    public Map<String, Object> getStats() {
        Instant threshold = Instant.now().minusSeconds(heartbeatTimeoutMinutes * 60L);
        Map<String, Object> stats = new HashMap<>();
        stats.put("total",   instalacionRepo.count());
        stats.put("activas", instalacionRepo.countByActivaTrue());
        stats.put("online",  instalacionRepo.countByLastSeenAtAfter(threshold));
        return stats;
    }

    // ── Job: marcar suscripciones expiradas ──────────────────
    @Scheduled(fixedDelay = 3_600_000)  // cada hora
    @Transactional
    public void expirarSuscripciones() {
        Instant now = Instant.now();
        suscripcionRepo.findAll().stream()
            .filter(s -> s.getEstado() == Suscripcion.Estado.ACTIVA
                      && s.getFinAt() != null && s.getFinAt().isBefore(now))
            .forEach(s -> {
                s.setEstado(Suscripcion.Estado.VENCIDA);
                suscripcionRepo.save(s);
                // Downgrade plan
                Instalacion inst = s.getInstalacion();
                inst.setPlan(Instalacion.Plan.FREE);
                instalacionRepo.save(inst);
            });
    }

    // ── Helpers privados ──────────────────────────────────────
    private String generarToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private void crearFeaturesDefault(Instalacion inst) {
        List<String> defaultOn  = List.of("caja","productos","proveedores","clientes");
        List<String> defaultOff = List.of("ofertas","lotes","remoto","cuentas_corrientes","dashboard");
        for (String f : defaultOn)  featureFlagRepo.save(FeatureFlag.builder()
            .instalacion(inst).nombre(f).habilitado(true).build());
        for (String f : defaultOff) featureFlagRepo.save(FeatureFlag.builder()
            .instalacion(inst).nombre(f).habilitado(false).build());
    }

    private Map<String, Object> comandoToMap(ComandoRemoto c) {
        Map<String, Object> m = new HashMap<>();
        m.put("id",      c.getId());
        m.put("tipo",    c.getTipo());
        m.put("payload", c.getPayload());
        return m;
    }
}
