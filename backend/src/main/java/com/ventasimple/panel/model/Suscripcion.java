package com.ventasimple.panel.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "suscripcion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Suscripcion {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instalacion_id", nullable = false)
    private Instalacion instalacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan", nullable = false)
    private Instalacion.Plan plan;

    @Column(name = "inicio_at", nullable = false)
    private Instant inicioAt;

    @Column(name = "fin_at")
    private Instant finAt;

    @Column(name = "monto", precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "moneda")
    private String moneda = "ARS";

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private Estado estado = Estado.ACTIVA;

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist void prePersist() { createdAt = Instant.now(); }

    public enum Estado { ACTIVA, VENCIDA, CANCELADA }
}
