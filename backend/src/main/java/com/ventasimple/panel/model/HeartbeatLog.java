package com.ventasimple.panel.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "heartbeat_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HeartbeatLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instalacion_id", nullable = false)
    private Instalacion instalacion;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "version_app")
    private String versionApp;

    @Column(name = "metrics", columnDefinition = "TEXT")
    private String metrics;  // JSON snapshot

    @PrePersist void prePersist() { if (timestamp == null) timestamp = Instant.now(); }
}
