-- V1__initial_schema.sql
-- Schema inicial del panel administrativo Venta Simple

-- ── Panel admins (los que operan este panel) ─────────────────
CREATE TABLE panel_admin (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    nombre        VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol           VARCHAR(50)  NOT NULL DEFAULT 'admin',  -- admin | superadmin
    activo        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Instalaciones (cada cliente con su instancia de VS) ──────
CREATE TABLE instalacion (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_negocio VARCHAR(255) NOT NULL,
    email_contacto VARCHAR(255),
    install_token  VARCHAR(128) NOT NULL UNIQUE,  -- Bearer token que usa VS
    version_app    VARCHAR(50),
    os_info        VARCHAR(255),
    plan           VARCHAR(50)  NOT NULL DEFAULT 'FREE',  -- FREE|BASIC|PRO|ENTERPRISE
    plan_expires_at TIMESTAMP,
    last_seen_at   TIMESTAMP,
    last_metrics   TEXT,         -- JSON con cpu/ram/disco
    ip_address     VARCHAR(64),
    activa         BOOLEAN NOT NULL DEFAULT TRUE,
    notas          TEXT,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Feature flags por instalación ────────────────────────────
CREATE TABLE feature_flag (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instalacion_id UUID NOT NULL REFERENCES instalacion(id) ON DELETE CASCADE,
    nombre         VARCHAR(100) NOT NULL,   -- 'ofertas', 'remoto', 'lotes', etc.
    habilitado     BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (instalacion_id, nombre)
);

-- ── Licencias ────────────────────────────────────────────────
CREATE TABLE licencia (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clave          VARCHAR(64) NOT NULL UNIQUE,  -- 'XXXX-XXXX-XXXX-XXXX'
    instalacion_id UUID REFERENCES instalacion(id) ON DELETE SET NULL,
    plan           VARCHAR(50) NOT NULL DEFAULT 'PRO',
    activada_at    TIMESTAMP,
    expira_at      TIMESTAMP,
    estado         VARCHAR(30) NOT NULL DEFAULT 'DISPONIBLE',  -- DISPONIBLE|ACTIVA|EXPIRADA|REVOCADA
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Suscripciones ─────────────────────────────────────────────
CREATE TABLE suscripcion (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instalacion_id UUID NOT NULL REFERENCES instalacion(id) ON DELETE CASCADE,
    plan           VARCHAR(50) NOT NULL,
    inicio_at      TIMESTAMP NOT NULL,
    fin_at         TIMESTAMP,
    monto          DECIMAL(10,2),
    moneda         VARCHAR(10) DEFAULT 'ARS',
    estado         VARCHAR(30) NOT NULL DEFAULT 'ACTIVA',  -- ACTIVA|VENCIDA|CANCELADA
    notas          TEXT,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Heartbeat logs (historial de conexiones) ─────────────────
CREATE TABLE heartbeat_log (
    id             BIGSERIAL PRIMARY KEY,
    instalacion_id UUID NOT NULL REFERENCES instalacion(id) ON DELETE CASCADE,
    timestamp      TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address     VARCHAR(64),
    version_app    VARCHAR(50),
    metrics        TEXT  -- JSON snapshot
);

-- ── Comandos remotos ─────────────────────────────────────────
CREATE TABLE comando_remoto (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instalacion_id UUID NOT NULL REFERENCES instalacion(id) ON DELETE CASCADE,
    tipo           VARCHAR(50) NOT NULL,   -- 'CMD' | 'FEATURE_UPDATE' | 'CONFIG_UPDATE' | 'RESTART'
    payload        TEXT,                   -- JSON
    estado         VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',  -- PENDIENTE|EJECUTADO|FALLIDO
    resultado      TEXT,
    creado_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    ejecutado_at   TIMESTAMP
);

-- ── Índices ───────────────────────────────────────────────────
CREATE INDEX idx_instalacion_plan         ON instalacion(plan);
CREATE INDEX idx_instalacion_last_seen    ON instalacion(last_seen_at);
CREATE INDEX idx_instalacion_token        ON instalacion(install_token);
CREATE INDEX idx_heartbeat_instalacion    ON heartbeat_log(instalacion_id);
CREATE INDEX idx_heartbeat_timestamp      ON heartbeat_log(timestamp);
CREATE INDEX idx_comando_instalacion      ON comando_remoto(instalacion_id);
CREATE INDEX idx_comando_estado           ON comando_remoto(estado);
CREATE INDEX idx_feature_instalacion      ON feature_flag(instalacion_id);

-- ── Admin inicial (password: ventasimple → bcrypt) ───────────
-- Reemplazar el hash en producción con: bcrypt('tu_contraseña')
INSERT INTO panel_admin (email, nombre, password_hash, rol)
VALUES ('admin@ventasimple.com', 'Super Admin',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq', -- 'ventasimple'
        'superadmin');
