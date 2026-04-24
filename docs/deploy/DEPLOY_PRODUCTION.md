# Deploy a Producción — VentaSimple

## Arquitectura general

```
Hostinger DNS
  ventasimple.cloud         → Vercel (frontend Next.js)
  api.ventasimple.cloud     → Railway (backend FastAPI)
  soporte.ventasimple.cloud → Vercel (mismo proyecto, ruta /soporte/*)

Vercel
  Proyecto: frontend
  Dominio principal: ventasimple.cloud
  Dominio soporte:   soporte.ventasimple.cloud

Railway
  Proyecto: venta-simple-web
  Servicio: backend-py
  Dominio:  api.ventasimple.cloud
```

---

## 1. Backend → Railway

### Primer deploy
```bash
cd backend-py
railway login
railway link          # elegir proyecto venta-simple-web → servicio backend-py
railway up            # sube el código y buildea
```

### Variables de entorno en Railway
Ir a: Railway → Proyecto → backend-py → Variables

| Variable | Valor |
|---|---|
| `DATABASE_URL` | URL de Supabase (Transaction Pooler puerto 6543) |
| `SECRET_KEY` | Clave aleatoria de 64 caracteres: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
| `FRONTEND_URL` | `https://ventasimple.cloud` |
| `RESEND_API_KEY` | Clave de Resend (resend.com) |
| `FROM_EMAIL` | `VentaSimple <no-reply@ventasimple.cloud>` |
| `MP_ACCESS_TOKEN` | Access token de Mercado Pago producción |
| `WEBHOOK_PUBLIC_URL` | `https://api.ventasimple.cloud` |
| `SUPPORT_PASSWORD` | Contraseña de soporte@ventasimple.cloud (mínimo 16 chars) |

### Dominio personalizado
1. Railway → Settings → Networking → Add Custom Domain
2. Ingresar: `api.ventasimple.cloud`
3. Copiar el CNAME que muestra Railway (algo como `xxx.railway.app`)

### Verificar
```bash
curl https://api.ventasimple.cloud/health
# → {"status":"healthy"}
```

---

## 2. Frontend → Vercel

### Variables de entorno en Vercel
Ir a: Vercel → Proyecto frontend → Settings → Environment Variables

| Variable | Entorno | Valor |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Production | `https://api.ventasimple.cloud` |
| `NEXT_PUBLIC_API_URL` | Development | `http://localhost:8000` |
| `OPENAI_API_KEY` | Production | (opcional, solo para chat con IA) |

### Dominio principal
1. Vercel → Project → Settings → Domains
2. Agregar: `ventasimple.cloud`
3. Agregar: `www.ventasimple.cloud` (redirige a principal)

### Dominio soporte
1. Vercel → Project → Settings → Domains
2. Agregar: `soporte.ventasimple.cloud`
   - El middleware.ts detecta el hostname y redirige a `/soporte/login`

---

## 3. DNS en Hostinger

Ir a: Hostinger → Dominios → ventasimple.cloud → Zona DNS

### Registros requeridos

```
Tipo    Nombre                  Valor
──────────────────────────────────────────────────────────────
A       @                       76.76.21.21        (Vercel IP)
CNAME   www                     cname.vercel-dns.com
CNAME   api                     [CNAME de Railway]
CNAME   soporte                 cname.vercel-dns.com
```

> Los valores exactos de Vercel IP y Railway CNAME los da cada plataforma al agregar el dominio.

---

## 4. Cuenta de soporte

La cuenta `soporte@ventasimple.cloud` se crea **automáticamente** al arrancar el backend
si la variable `SUPPORT_PASSWORD` está configurada.

- URL de acceso: `https://soporte.ventasimple.cloud`
- Email: `soporte@ventasimple.cloud`
- Contraseña: la definida en `SUPPORT_PASSWORD`

---

## 5. Cómo probar producción

```bash
# Backend health
curl https://api.ventasimple.cloud/health

# Login soporte (devuelve JWT)
curl -X POST https://api.ventasimple.cloud/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"soporte@ventasimple.cloud","password":"TU_PASSWORD"}'

# Frontend
open https://ventasimple.cloud
open https://soporte.ventasimple.cloud
```

---

## 6. Volver a localhost (desarrollo)

En `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend:
```bash
cd backend-py
uvicorn app.main:app --reload --port 8000
```

Desktop:
```bash
# Opcional — sobreescribe la URL del backend para testing local
set VENTASIMPLE_API_URL=http://localhost:8000
npm start
```

---

## 7. Re-deploy

```bash
# Backend (Railway auto-deploya al push)
git push origin main

# Frontend (Vercel auto-deploya al push)
git push origin main
```

Railway y Vercel monitorean el branch `main` y despliegan automáticamente.
