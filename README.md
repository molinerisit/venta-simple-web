# Venta Simple — Plataforma Web SaaS

> Panel administrativo multi-tenant para el ecosistema **Venta Simple POS**. Permite a dueños de negocio gestionar ventas, stock, clientes y métricas desde cualquier navegador, con sincronización en tiempo real con la app de escritorio.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────┐
│                  CLIENTE (Navegador)                     │
│                                                          │
│   Next.js 16 + TypeScript + shadcn/ui + Tailwind        │
│   App Router · SSG/SSR · Dark theme forzado             │
│   Deploy: Vercel (frontend-eight-lyart-56.vercel.app)   │
└──────────────────────────┬──────────────────────────────┘
                           │ REST + JWT
┌──────────────────────────▼──────────────────────────────┐
│            BACKEND PRIMARIO (FastAPI / Python)           │
│                                                          │
│   Multi-tenant · JWT + bcrypt · Resend (emails)         │
│   Mercado Pago (suscripciones recurrentes)               │
│   Deploy: Vercel Serverless (backend-py-mauve.vercel.app)│
└──────────────────────────┬──────────────────────────────┘
                           │ SQLAlchemy
┌──────────────────────────▼──────────────────────────────┐
│              BASE DE DATOS (Supabase / PostgreSQL)       │
│                                                          │
│   Multi-tenant por tenant_id · Feature flags por tenant  │
│   Migración manual via schema.sql                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           BACKEND LEGACY (Spring Boot / Java)            │
│                                                          │
│   Gestión de instalaciones del POS desktop               │
│   Heartbeats · Comandos remotos · Licencias físicas      │
│   Flyway migrations · PostgreSQL                         │
└─────────────────────────────────────────────────────────┘
```

---

## Estructura del monorepo

```
venta-simple-web/
├── frontend/              # Next.js 16 — Panel web + Landing
├── backend-py/            # FastAPI — API principal multi-tenant
└── backend/               # Spring Boot — API legacy instalaciones
```

---

## Stack tecnológico

### Frontend (`frontend/`)

| Tecnología | Uso |
|------------|-----|
| Next.js 16 (App Router) | Framework React con SSR/SSG |
| TypeScript | Tipado estático |
| shadcn/ui + Radix UI | Componentes accesibles |
| Tailwind CSS v4 | Estilos utilitarios |
| Axios | Cliente HTTP hacia la API |
| Recharts | Gráficos de métricas |
| Inter (Google Fonts) | Tipografía |

### Backend Python (`backend-py/`)

| Tecnología | Uso |
|------------|-----|
| FastAPI 0.115 | Framework API REST |
| SQLAlchemy 2.0 | ORM + queries raw |
| psycopg2 | Driver PostgreSQL |
| python-jose | Generación y validación JWT |
| passlib + bcrypt | Hash de contraseñas |
| Resend | Emails transaccionales |
| Mercado Pago SDK | Suscripciones recurrentes |
| pydantic-settings | Gestión de variables de entorno |
| Vercel Serverless | Deploy via `api/index.py` |

### Backend Java (`backend/`)

| Tecnología | Uso |
|------------|-----|
| Spring Boot 3 | Framework API REST |
| Spring Security + JWT | Autenticación |
| Spring Data JPA | ORM |
| Flyway | Migraciones de base de datos |
| PostgreSQL | Base de datos |

---

## Módulos del Backend Python

| Router | Prefijo | Descripción |
|--------|---------|-------------|
| `auth` | `/api/auth` | Registro, login, verificación email, reset password, desktop callback |
| `productos` | `/api/productos` | CRUD productos con categorías |
| `proveedores` | `/api/proveedores` | CRUD proveedores |
| `clientes` | `/api/clientes` | CRUD clientes con historial de ventas |
| `ventas` | `/api/ventas` | Registro y consulta de ventas |
| `metricas` | `/api/metricas` | KPIs, top productos, ventas por método |
| `sync` | `/api/sync` | Sincronización bidireccional con el POS desktop |
| `admin` | `/api/admin` | Gestión de tenants (superadmin) |
| `suscripciones` | `/api/suscripciones` | Mercado Pago: crear, pausar, cancelar, reanudar |
| `licencias` | `/api/licencias` | Generación y validación de licencias |
| `cuenta` | `/api/cuenta` | Perfil del tenant, token de activación desktop |

## Vistas del Frontend

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page (CRO) con hero, pricing, FAQ, soporte 24/7 |
| `/login` | Inicio de sesión |
| `/registro` | Registro con verificación de email |
| `/verify-email` | Activación de cuenta |
| `/forgot-password` | Solicitud de reset |
| `/reset-password` | Restablecimiento de contraseña |
| `/descargar` | Descarga de la app de escritorio |

### Panel (requiere auth)
| Ruta | Descripción |
|------|-------------|
| `/dashboard` | KPIs del período, ventas, stock bajo mínimo |
| `/ventas` | Historial de ventas con filtros |
| `/productos` | Catálogo con gestión de stock |
| `/clientes` | ABM clientes con historial |
| `/proveedores` | ABM proveedores |
| `/metricas` | Análisis avanzado: heatmap, top productos, comparativas |
| `/licencias` | Estado de licencia y activación |
| `/suscripciones` | Gestión del plan y facturación (Mercado Pago) |
| `/cuenta` | Perfil, activación desktop, datos del negocio |
| `/instalaciones` | Listado de instancias POS conectadas (legacy) |
| `/instalaciones/[id]` | Detalle de instalación, heartbeats, feature flags |
| `/admin` | Panel superadmin: tenants, stats globales |

---

## Modelo de autenticación

```
Roles:
  superadmin  → acceso total a /api/admin
  admin       → panel_admins table
  owner       → tenant owner, acceso a su propio tenant

Flujo registro:
  POST /api/auth/register
    → crea tenant con email_verified=FALSE
    → envía email de verificación (Resend)
  GET /api/auth/verify-email?token=...
    → verifica email, genera licencia FREE, envía bienvenida
  POST /api/auth/login
    → devuelve JWT con { sub, rol, tenant_id }
```

---

## Variables de entorno

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://backend-py-mauve.vercel.app
```

### Backend Python (`backend-py/.env`)
```env
DATABASE_URL=postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
SECRET_KEY=<64-char-random>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=https://frontend-eight-lyart-56.vercel.app

# Email
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=VentaSimple <noreply@orbytal-ai.com>

# Mercado Pago
MP_ACCESS_TOKEN=APP_USR-...
WEBHOOK_PUBLIC_URL=https://backend-py-mauve.vercel.app
```

### Backend Java (`backend/src/main/resources/application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://host:5432/ventasimple
    username: postgres
    password: secret
jwt:
  secret: <secret>
```

---

## Desarrollo local

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # configurar NEXT_PUBLIC_API_URL
npm run dev                         # http://localhost:3000
```

### Backend Python
```bash
cd backend-py
python -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                # configurar variables
uvicorn app.main:app --reload --port 8000
```

### Backend Java (legacy)
```bash
cd backend
./mvnw spring-boot:run
```

---

## Deploy (Vercel)

Ambos servicios están deployados en Vercel como proyectos independientes:

| Servicio | Proyecto Vercel | URL |
|----------|-----------------|-----|
| Frontend | `frontend` | `frontend-eight-lyart-56.vercel.app` |
| Backend Python | `backend-py` | `backend-py-mauve.vercel.app` |

```bash
# Deploy manual (desde cada directorio)
cd frontend  && vercel --prod
cd backend-py && vercel --prod
```

---

## Ecosistema Venta Simple

| Repositorio | Descripción | Stack |
|-------------|-------------|-------|
| **venta-simple-web** | Plataforma web SaaS (este repo) | Next.js + FastAPI + PostgreSQL |
| [venta-simple-pos](https://github.com/molinerisit/venta-simple-pos) | App de escritorio POS | Electron + SQLite + Node.js |

---

## Licencia

MIT © [Julian Molineris](https://github.com/molinerisit)
