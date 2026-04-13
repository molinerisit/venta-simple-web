package com.ventasimple.panel.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "feature_flag",
    uniqueConstraints = @UniqueConstraint(columnNames = {"instalacion_id","nombre"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FeatureFlag {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instalacion_id", nullable = false)
    private Instalacion instalacion;

    @Column(name = "nombre", nullable = false)
    private String nombre;   // "ofertas", "remoto", "lotes", "cuentas_corrientes", etc.

    @Column(name = "habilitado", nullable = false)
    private Boolean habilitado = true;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist @PreUpdate
    void touch() { updatedAt = Instant.now(); }
}
