package com.ventasimple.panel.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "licencia")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Licencia {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "clave", nullable = false, unique = true)
    private String clave;   // "XXXX-XXXX-XXXX-XXXX"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instalacion_id")
    private Instalacion instalacion;  // null si no está asignada

    @Enumerated(EnumType.STRING)
    @Column(name = "plan", nullable = false)
    private Instalacion.Plan plan = Instalacion.Plan.PRO;

    @Column(name = "activada_at")
    private Instant activadaAt;

    @Column(name = "expira_at")
    private Instant expiraAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private Estado estado = Estado.DISPONIBLE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist void prePersist() { createdAt = Instant.now(); }

    public enum Estado { DISPONIBLE, ACTIVA, EXPIRADA, REVOCADA }
}
