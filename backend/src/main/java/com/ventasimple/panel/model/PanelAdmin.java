package com.ventasimple.panel.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "panel_admin")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PanelAdmin {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "rol", nullable = false)
    private String rol = "admin";   // "admin" | "superadmin"

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist void prePersist()  { createdAt = updatedAt = Instant.now(); }
    @PreUpdate  void preUpdate()   { updatedAt = Instant.now(); }
}
