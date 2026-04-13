package com.ventasimple.panel.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "comando_remoto")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ComandoRemoto {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instalacion_id", nullable = false)
    private Instalacion instalacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private Tipo tipo;

    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload;     // JSON

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private Estado estado = Estado.PENDIENTE;

    @Column(name = "resultado", columnDefinition = "TEXT")
    private String resultado;

    @Column(name = "creado_at", nullable = false, updatable = false)
    private Instant creadoAt;

    @Column(name = "ejecutado_at")
    private Instant ejecutadoAt;

    @PrePersist void prePersist() { creadoAt = Instant.now(); }

    public enum Tipo { CMD, FEATURE_UPDATE, CONFIG_UPDATE, RESTART, CUSTOM }
    public enum Estado { PENDIENTE, EJECUTADO, FALLIDO }
}
