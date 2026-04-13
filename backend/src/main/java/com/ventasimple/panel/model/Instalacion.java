package com.ventasimple.panel.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.*;

@Entity @Table(name = "instalacion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Instalacion {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nombre_negocio", nullable = false)
    private String nombreNegocio;

    @Column(name = "email_contacto")
    private String emailContacto;

    @Column(name = "install_token", nullable = false, unique = true)
    private String installToken;

    @Column(name = "version_app")
    private String versionApp;

    @Column(name = "os_info")
    private String osInfo;

    @Column(name = "plan", nullable = false)
    @Enumerated(EnumType.STRING)
    private Plan plan = Plan.FREE;

    @Column(name = "plan_expires_at")
    private Instant planExpiresAt;

    @Column(name = "last_seen_at")
    private Instant lastSeenAt;

    @Column(name = "last_metrics", columnDefinition = "TEXT")
    private String lastMetrics;  // JSON

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "activa", nullable = false)
    private Boolean activa = true;

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "instalacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<FeatureFlag> featureFlags = new ArrayList<>();

    @OneToMany(mappedBy = "instalacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ComandoRemoto> comandos = new ArrayList<>();

    @PrePersist
    void prePersist() { createdAt = updatedAt = Instant.now(); }

    @PreUpdate
    void preUpdate() { updatedAt = Instant.now(); }

    /** True si el último heartbeat fue hace menos de X minutos */
    public boolean isOnline(int timeoutMinutes) {
        if (lastSeenAt == null) return false;
        return lastSeenAt.isAfter(Instant.now().minusSeconds(timeoutMinutes * 60L));
    }

    public enum Plan { FREE, BASIC, PRO, ENTERPRISE }
}
