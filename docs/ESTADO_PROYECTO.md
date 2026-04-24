# Estado del proyecto — VentaSimple
_Actualizado: 2026-04-24_

---

## Infraestructura en producción

| Servicio | URL | Plataforma |
|---|---|---|
| Frontend / Landing | https://ventasimple.cloud | Vercel |
| Panel de soporte | https://soporte.ventasimple.cloud | Vercel (mismo proyecto) |
| Backend API | https://api.ventasimple.cloud | Railway |
| Base de datos | Supabase proyecto `mrlgrhqlvtpopqfvqoxa` | Supabase (AWS us-east-2) |

---

## Completado en esta sesión (2026-04-24)

### Base de datos — Supabase
- Corrida `schema.sql` contra el proyecto Supabase: 13 tablas creadas (`tenants`, `panel_admins`, `productos`, `proveedores`, `clientes`, `ventas`, `detalle_ventas`, `movimientos_stock`, `sync_log`, `feature_flags`, `licencias`, `support_conversations`, `support_messages`)
- Agregadas tablas `support_conversations` y `support_messages` al `schema.sql`

### Backend — Railway
- Deploy activo en Railway (proyecto `venta-simple-backend`, servicio `venta-simple-backend`)
- Todas las variables de entorno configuradas: `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `FRONTEND_URL`, `RESEND_API_KEY`, `FROM_EMAIL`, `MP_ACCESS_TOKEN`, `WEBHOOK_PUBLIC_URL`, `SUPPORT_PASSWORD`
- Cuenta `soporte@ventasimple.cloud` se crea automáticamente al iniciar si `SUPPORT_PASSWORD` está seteada (bcrypt 14 rounds)
- Fix: sintaxis `CAST(:context AS jsonb)` en lugar de `:context::jsonb` (incompatible con SQLAlchemy + psycopg2)

### DNS — Hostinger (ventasimple.cloud)
```
A       @               216.198.79.1           → Vercel (frontend)
CNAME   www             774760ebbd1bf63b.vercel-dns-017.com
CNAME   api             0r5lak7u.up.railway.app → Railway (backend)
CNAME   soporte         774760ebbd1bf63b.vercel-dns-017.com
TXT     _railway-verify.api   railway-verify=f23be98be30c...
```

### Frontend — Vercel
- Variable `NEXT_PUBLIC_API_URL=https://api.ventasimple.cloud` configurada en producción
- Dominio `soporte.ventasimple.cloud` agregado al proyecto
- Middleware corregido: lee `x-forwarded-host` (header real en Vercel) antes de `host`
- Fix: propiedad `border` duplicada en `app/(soporte)/soporte/page.tsx`
- Panel soporte accesible en https://soporte.ventasimple.cloud (login: soporte@ventasimple.cloud)

### Desktop (venta-simple-pos)
- Botón "Chatear con soporte" agregado en el tab Estado (encima de WhatsApp)
- Al hacer click lleva directamente al tab Chat

---

## Lo que falta implementar

### Corto plazo
- [ ] **Probar chat end-to-end**: abrir conversación desde el desktop → ver en panel soporte → responder desde soporte → ver en desktop
- [ ] **Eliminar viejo backend de Vercel** (`backend-py-mauve.vercel.app`) — confirmar primero que Railway funciona estable
- [ ] **Notificaciones sonoras** en el panel soporte cuando llega un mensaje nuevo
- [ ] **Rebuild y nueva versión del instalador** del desktop app (venta-simple-pos) con todos los cambios de esta sesión

### Mediano plazo
- [ ] **Email de verificación** — configurar dominio en Resend (`ventasimple.cloud`) para que los emails salgan desde `no-reply@ventasimple.cloud`
- [ ] **Suscripciones MercadoPago** — probar el flujo completo de pago en producción
- [ ] **Password del admin** — definir e insertar hash correcto en `panel_admins` para `admin@ventasimple.com`
- [ ] **Dashboard web** — métricas/estadísticas para el panel admin (superadmin)
- [ ] **Notificaciones push** o email cuando llega un ticket de soporte nuevo

### Largo plazo
- [ ] **Chat en tiempo real** — reemplazar polling (3s) por WebSockets o SSE
- [ ] **Historial de conversaciones** en el desktop — que el usuario pueda ver conversaciones anteriores
- [ ] **Auto-respuestas** del bot de soporte para preguntas frecuentes

---

## Credenciales de prueba

| Cuenta | Email | Password | Rol |
|---|---|---|---|
| Soporte web | soporte@ventasimple.cloud | n1@sistemas | support |
| Admin (pendiente hash) | admin@ventasimple.com | (a definir) | superadmin |

---

## Comandos útiles

```bash
# Ver logs del backend en Railway
cd backend-py && railway logs --tail 50

# Forzar redeploy del backend
cd backend-py && railway up --detach

# Verificar salud del backend
curl https://api.ventasimple.cloud/health

# Verificar DNS
nslookup api.ventasimple.cloud 8.8.8.8
nslookup soporte.ventasimple.cloud 8.8.8.8
```
