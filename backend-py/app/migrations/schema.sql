-- Ejecutar en Supabase SQL Editor
-- Ver documentacion/base-de-datos.md para el esquema completo con índices y triggers

CREATE TABLE IF NOT EXISTS tenants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_negocio   VARCHAR(200) NOT NULL,
  email            VARCHAR(200) UNIQUE NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  plan             VARCHAR(20)  NOT NULL DEFAULT 'FREE',
  plan_expires_at  TIMESTAMPTZ,
  mp_preapproval_id VARCHAR(100),
  email_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
  activo           BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_seen_at     TIMESTAMPTZ,
  version_app      VARCHAR(20),
  ip_address       VARCHAR(45)
);

-- Si la tabla ya existe, agregar columnas si faltan:
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS mp_preapproval_id VARCHAR(100);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS last_diagnostic JSONB;

CREATE TABLE IF NOT EXISTS panel_admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(200) UNIQUE NOT NULL,
  nombre        VARCHAR(200) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol           VARCHAR(20)  NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO panel_admins (email, nombre, password_hash, rol) VALUES (
  'admin@ventasimple.com', 'SuperAdmin',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS3oWmq',
  'superadmin'
) ON CONFLICT (email) DO NOTHING;

-- Cuenta de soporte: el hash se genera automáticamente al bootear el backend
-- si la variable de entorno SUPPORT_PASSWORD está configurada.
-- No insertar aquí — el startup.py lo maneja con bcrypt 14 rounds.

CREATE TABLE IF NOT EXISTS productos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nombre         VARCHAR(200) NOT NULL,
  codigo         VARCHAR(100),
  precio         DECIMAL(12,2) NOT NULL DEFAULT 0,
  precio_costo   DECIMAL(12,2) DEFAULT 0,
  stock          INTEGER DEFAULT 0,
  stock_minimo   INTEGER DEFAULT 0,
  categoria      VARCHAR(100),
  descripcion    TEXT,
  unidad         VARCHAR(50) DEFAULT 'unidad',
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ,
  local_id       VARCHAR(100),
  sync_version   INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_productos_tenant ON productos(tenant_id);

-- Campos extendidos para sincronización con desktop (agregar si la tabla ya existe)
ALTER TABLE productos ADD COLUMN IF NOT EXISTS codigo_barras VARCHAR(100);
ALTER TABLE productos ADD COLUMN IF NOT EXISTS plu VARCHAR(50);
ALTER TABLE productos ADD COLUMN IF NOT EXISTS pesable BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS acceso_rapido BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS maneja_lotes BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS departamento VARCHAR(100);
ALTER TABLE productos ADD COLUMN IF NOT EXISTS familia VARCHAR(100);

CREATE TABLE IF NOT EXISTS proveedores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nombre      VARCHAR(200) NOT NULL,
  email       VARCHAR(200),
  telefono    VARCHAR(50),
  direccion   TEXT,
  cuit        VARCHAR(20),
  notas       TEXT,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ,
  local_id    VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_proveedores_tenant ON proveedores(tenant_id);

CREATE TABLE IF NOT EXISTS clientes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nombre      VARCHAR(200) NOT NULL,
  email       VARCHAR(200),
  telefono    VARCHAR(50),
  direccion   TEXT,
  dni         VARCHAR(20),
  deuda       DECIMAL(12,2) DEFAULT 0,
  notas       TEXT,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ,
  local_id    VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_clientes_tenant ON clientes(tenant_id);

CREATE TABLE IF NOT EXISTS ventas (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cliente_id   UUID REFERENCES clientes(id) ON DELETE SET NULL,
  total        DECIMAL(12,2) NOT NULL,
  descuento    DECIMAL(12,2) DEFAULT 0,
  metodo_pago  VARCHAR(50) DEFAULT 'efectivo',
  estado       VARCHAR(20) NOT NULL DEFAULT 'completada',
  notas        TEXT,
  fecha        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  local_id     VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_ventas_tenant ON ventas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha  ON ventas(tenant_id, fecha DESC);

CREATE TABLE IF NOT EXISTS detalle_ventas (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id         UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id      UUID REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto  VARCHAR(200) NOT NULL,
  cantidad         INTEGER NOT NULL,
  precio_unitario  DECIMAL(12,2) NOT NULL,
  subtotal         DECIMAL(12,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_detalle_venta ON detalle_ventas(venta_id);

CREATE TABLE IF NOT EXISTS movimientos_stock (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  producto_id  UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  tipo         VARCHAR(20) NOT NULL,
  cantidad     INTEGER NOT NULL,
  stock_ant    INTEGER,
  stock_nuevo  INTEGER,
  motivo       TEXT,
  fecha        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  tabla        VARCHAR(100) NOT NULL,
  registro_id  UUID,
  local_id     VARCHAR(100),
  operacion    VARCHAR(10) NOT NULL,
  datos        JSONB,
  origen       VARCHAR(20) NOT NULL DEFAULT 'desktop',
  aplicado_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version      INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_sync_tenant ON sync_log(tenant_id, aplicado_at DESC);

CREATE TABLE IF NOT EXISTS feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nombre      VARCHAR(100) NOT NULL,
  habilitado  BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(tenant_id, nombre)
);

CREATE TABLE IF NOT EXISTS licencias (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave        VARCHAR(64) UNIQUE NOT NULL,
  plan         VARCHAR(20) NOT NULL DEFAULT 'PRO',
  estado       VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE',
  tenant_id    UUID REFERENCES tenants(id) ON DELETE SET NULL,
  activada_at  TIMESTAMPTZ,
  expira_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     TEXT NOT NULL,
  business_name TEXT,
  app_version   TEXT,
  context       JSONB,
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sup_conv_client ON support_conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_sup_conv_status ON support_conversations(status);

CREATE TABLE IF NOT EXISTS support_messages (
  id              BIGSERIAL PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,
  sender          TEXT NOT NULL,
  text            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sup_msg_conv ON support_messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS business_hours (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  day        SMALLINT NOT NULL,
  open_time  TIME NOT NULL DEFAULT '09:00',
  close_time TIME NOT NULL DEFAULT '18:00',
  is_open    BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(tenant_id, day)
);
CREATE INDEX IF NOT EXISTS idx_bh_tenant ON business_hours(tenant_id);

CREATE TABLE IF NOT EXISTS support_commands (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  command_type TEXT NOT NULL,
  params       JSONB NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT 'pending',
  created_by   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  executed_at  TIMESTAMPTZ,
  result       JSONB
);
CREATE INDEX IF NOT EXISTS idx_sc_tenant  ON support_commands(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_sc_created ON support_commands(created_at DESC);
