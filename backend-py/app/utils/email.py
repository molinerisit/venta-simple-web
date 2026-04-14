"""
Utilidad para envío de emails transaccionales via Resend.
"""
import resend
from ..config import get_settings


def _init() -> str:
    """Inicializa resend y devuelve el from_email limpio."""
    settings = get_settings()
    key = settings.resend_api_key.strip()
    if not key:
        raise RuntimeError("RESEND_API_KEY no configurado")
    resend.api_key = key
    return settings.from_email.strip()


def send_verification(to_email: str, nombre: str, verify_url: str) -> None:
    from_email = _init()
    html = f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#16181f;border-radius:16px;border:1px solid rgba(255,255,255,.08);overflow:hidden;">
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,.06);">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:36px;height:36px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);border-radius:10px;text-align:center;vertical-align:middle;">
                  <span style="color:#fff;font-weight:900;font-size:14px;">VS</span>
                </td>
                <td style="padding-left:10px;color:#fff;font-weight:800;font-size:16px;">Venta Simple</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <h1 style="margin:0 0 8px;color:#fff;font-size:22px;font-weight:700;">Verificá tu email</h1>
            <p style="margin:0 0 20px;color:#a3acbb;font-size:14px;line-height:1.6;">
              Hola <strong style="color:#e2e8f0;">{nombre}</strong>, gracias por registrarte en Venta Simple.
              Hacé clic en el botón para activar tu cuenta.
            </p>
            <p style="margin:0 0 28px;color:#a3acbb;font-size:14px;line-height:1.6;">
              Este link es válido por <strong style="color:#e2e8f0;">24 horas</strong>.
            </p>
            <a href="{verify_url}"
               style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;">
              Verificar email y activar cuenta
            </a>
            <p style="margin:28px 0 0;color:#5a6070;font-size:12px;line-height:1.5;">
              O copiá este enlace en tu navegador:<br>
              <span style="color:#7c6fff;">{verify_url}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,.06);">
            <p style="margin:0;color:#5a6070;font-size:11px;">© 2025 Venta Simple · Si no creaste esta cuenta, ignorá este mensaje.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    resend.Emails.send({
        "from": from_email,
        "to": [to_email],
        "subject": "Verificá tu email — Venta Simple",
        "html": html,
    })


def send_plan_activated(to_email: str, nombre: str, plan: str, renews_at: str, cuenta_url: str) -> None:
    """Email moderno: plan activado, fecha de renovación, link a la cuenta. Sin clave."""
    from_email = _init()
    plan_label = {"FREE": "Free", "BASIC": "Básico", "PRO": "Pro", "ENTERPRISE": "Enterprise"}.get(plan, plan)
    html = f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#16181f;border-radius:16px;border:1px solid rgba(255,255,255,.08);overflow:hidden;">
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,.06);">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:36px;height:36px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);border-radius:10px;text-align:center;vertical-align:middle;">
                <span style="color:#fff;font-weight:900;font-size:14px;">VS</span>
              </td>
              <td style="padding-left:10px;color:#fff;font-weight:800;font-size:16px;">Venta Simple</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <h1 style="margin:0 0 8px;color:#fff;font-size:22px;font-weight:700;">Plan {plan_label} activado</h1>
            <p style="margin:0 0 24px;color:#a3acbb;font-size:14px;line-height:1.6;">
              Hola <strong style="color:#e2e8f0;">{nombre}</strong>, tu suscripción está activa.
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
              <tr>
                <td style="background:rgba(109,93,252,.1);border:1px solid rgba(109,93,252,.2);border-radius:12px;padding:18px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 4px;color:#b3a7ff;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">Plan activo</p>
                        <p style="margin:0;color:#fff;font-size:20px;font-weight:800;">{plan_label}</p>
                      </td>
                      <td style="text-align:right;">
                        <p style="margin:0 0 4px;color:#b3a7ff;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">Próxima renovación</p>
                        <p style="margin:0;color:#e2e8f0;font-size:14px;font-weight:700;">{renews_at}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 20px;color:#a3acbb;font-size:14px;line-height:1.6;">
              Para instalar y activar la app de escritorio, andá a tu cuenta y hacé clic en <strong style="color:#e2e8f0;">Activar en desktop</strong>.
            </p>
            <a href="{cuenta_url}"
               style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;">
              Ir a mi cuenta
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,.06);">
            <p style="margin:0;color:#5a6070;font-size:11px;">© 2025 Venta Simple · La renovación es automática. Podés cancelar desde tu cuenta en cualquier momento.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    resend.Emails.send({
        "from": from_email,
        "to": [to_email],
        "subject": f"Plan {plan_label} activado — Venta Simple",
        "html": html,
    })


def send_license_activated(to_email: str, nombre: str, clave: str, plan: str, download_url: str) -> None:
    from_email = _init()
    settings = get_settings()
    plan_label = {"FREE": "Free", "BASIC": "Básico", "PRO": "Pro", "ENTERPRISE": "Enterprise"}.get(plan, plan)
    login_url = f"{settings.frontend_url.strip()}/login"
    html = f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#16181f;border-radius:16px;border:1px solid rgba(255,255,255,.08);overflow:hidden;">
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,.06);">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:36px;height:36px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);border-radius:10px;text-align:center;vertical-align:middle;">
                  <span style="color:#fff;font-weight:900;font-size:14px;">VS</span>
                </td>
                <td style="padding-left:10px;color:#fff;font-weight:800;font-size:16px;">Venta Simple</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <h1 style="margin:0 0 8px;color:#fff;font-size:22px;font-weight:700;">
              {"¡Bienvenido!" if plan == "FREE" else f"¡Plan {plan_label} activado!"}
            </h1>
            <p style="margin:0 0 24px;color:#a3acbb;font-size:14px;line-height:1.6;">
              Hola <strong style="color:#e2e8f0;">{nombre}</strong>,
              {"tu cuenta ya está activa." if plan == "FREE" else f"tu suscripción al plan <strong style='color:#e2e8f0;'>{plan_label}</strong> fue procesada correctamente."}
              Guardá tu clave de licencia, la vas a necesitar al instalar la app de escritorio.
            </p>

            <!-- Clave de licencia -->
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="background:rgba(109,93,252,.1);border:1px solid rgba(109,93,252,.3);border-radius:12px;padding:20px 24px;text-align:center;">
                  <p style="margin:0 0 6px;color:#b3a7ff;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Tu clave de licencia</p>
                  <p style="margin:0;color:#fff;font-size:22px;font-weight:900;letter-spacing:.15em;font-family:monospace;">{clave}</p>
                  <p style="margin:6px 0 0;color:#5a6070;font-size:11px;">Plan: {plan_label}</p>
                </td>
              </tr>
            </table>

            <!-- Pasos -->
            <p style="margin:0 0 12px;color:#a3acbb;font-size:13px;font-weight:600;">Cómo empezar:</p>
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
              {"".join(f'''
              <tr>
                <td style="width:28px;vertical-align:top;padding-bottom:12px;">
                  <div style="width:22px;height:22px;background:rgba(109,93,252,.15);border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#b3a7ff;">{i}</div>
                </td>
                <td style="vertical-align:top;padding-bottom:12px;padding-left:8px;color:#a3acbb;font-size:13px;line-height:1.5;">{step}</td>
              </tr>''' for i, step in [
                  (1, f'Descargá la app de escritorio desde el link de abajo'),
                  (2, f'Al abrir por primera vez, elegí <strong style="color:#e2e8f0;">Activar con clave</strong> o simplemente iniciá sesión con tu email y contraseña'),
                  (3, 'Si usás la clave: ingresá <strong style="color:#e2e8f0;">{clave}</strong> y tu contraseña'),
              ])}
            </table>

            <a href="{download_url}"
               style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;margin-bottom:12px;">
              Descargar Venta Simple
            </a>
            <br>
            <a href="{login_url}"
               style="display:inline-block;margin-top:10px;padding:10px 24px;background:transparent;color:#b3a7ff;font-weight:600;font-size:13px;text-decoration:none;border-radius:10px;border:1px solid rgba(109,93,252,.3);">
              Ir al panel web
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,.06);">
            <p style="margin:0;color:#5a6070;font-size:11px;">© 2025 Venta Simple · Guardá este email, contiene tu clave de licencia.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    subject = "Tu licencia de Venta Simple" if plan == "FREE" else f"Plan {plan_label} activado — Venta Simple"
    resend.Emails.send({
        "from": from_email,
        "to": [to_email],
        "subject": subject,
        "html": html,
    })


def send_password_reset(to_email: str, nombre: str, reset_url: str) -> None:
    from_email = _init()
    html = f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#16181f;border-radius:16px;border:1px solid rgba(255,255,255,.08);overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,.06);">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:36px;height:36px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);border-radius:10px;text-align:center;vertical-align:middle;">
                  <span style="color:#fff;font-weight:900;font-size:14px;">VS</span>
                </td>
                <td style="padding-left:10px;color:#fff;font-weight:800;font-size:16px;">Venta Simple</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <h1 style="margin:0 0 8px;color:#fff;font-size:22px;font-weight:700;">Recuperar contraseña</h1>
            <p style="margin:0 0 24px;color:#a3acbb;font-size:14px;line-height:1.6;">
              Hola {nombre}, recibimos una solicitud para restablecer la contraseña de tu cuenta en Venta Simple.
            </p>
            <p style="margin:0 0 28px;color:#a3acbb;font-size:14px;line-height:1.6;">
              Este link es válido por <strong style="color:#e2e8f0;">60 minutos</strong>. Si no solicitaste esto, podés ignorar este mensaje.
            </p>
            <a href="{reset_url}"
               style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;">
              Restablecer contraseña
            </a>
            <p style="margin:28px 0 0;color:#5a6070;font-size:12px;line-height:1.5;">
              O copiá este enlace en tu navegador:<br>
              <span style="color:#7c6fff;">{reset_url}</span>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,.06);">
            <p style="margin:0;color:#5a6070;font-size:11px;">© 2025 Venta Simple · Este es un mensaje automático, no respondas este email.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    resend.Emails.send({
        "from": from_email,
        "to": [to_email],
        "subject": "Restablecer contraseña — Venta Simple",
        "html": html,
    })


def send_welcome(to_email: str, nombre: str) -> None:
    from_email = _init()
    settings = get_settings()
    login_url = f"{settings.frontend_url.strip()}/login"
    html = f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#16181f;border-radius:16px;border:1px solid rgba(255,255,255,.08);overflow:hidden;">
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,.06);">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:36px;height:36px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);border-radius:10px;text-align:center;vertical-align:middle;">
                  <span style="color:#fff;font-weight:900;font-size:14px;">VS</span>
                </td>
                <td style="padding-left:10px;color:#fff;font-weight:800;font-size:16px;">Venta Simple</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <h1 style="margin:0 0 8px;color:#fff;font-size:22px;font-weight:700;">¡Bienvenido a Venta Simple!</h1>
            <p style="margin:0 0 20px;color:#a3acbb;font-size:14px;line-height:1.6;">
              Hola <strong style="color:#e2e8f0;">{nombre}</strong>, tu cuenta fue creada exitosamente.
              Ya podés acceder al panel para gestionar tu negocio.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;width:100%;">
              <tr>
                <td style="background:rgba(109,93,252,.1);border:1px solid rgba(109,93,252,.2);border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 4px;color:#b3a7ff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;">Tu plan actual</p>
                  <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">FREE</p>
                  <p style="margin:4px 0 0;color:#a3acbb;font-size:12px;">Podés actualizar en cualquier momento desde Mi Cuenta.</p>
                </td>
              </tr>
            </table>
            <a href="{login_url}"
               style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#6d5dfc,#51c6ff);color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;">
              Ir al panel
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,.06);">
            <p style="margin:0;color:#5a6070;font-size:11px;">© 2025 Venta Simple · Este es un mensaje automático, no respondas este email.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    resend.Emails.send({
        "from": from_email,
        "to": [to_email],
        "subject": "¡Bienvenido a Venta Simple!",
        "html": html,
    })
