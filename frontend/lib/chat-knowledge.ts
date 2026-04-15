/* ─────────────────────────────────────────────────────────────────────────
   BASE DE CONOCIMIENTO — VentaSimple Chat
   Todo lo que el bot necesita saber sobre el producto.
   Se usa PRIMERO (sin API). OpenAI solo si no hay match.
───────────────────────────────────────────────────────────────────────── */

export const KNOWLEDGE_BASE = `
## Qué es VentaSimple
VentaSimple es un sistema de gestión para negocios pequeños (kioscos, almacenes, ferreterías, tiendas de ropa, etc.) en Argentina. Tiene una app de escritorio para Windows que funciona offline y un panel web para ver métricas y datos desde cualquier dispositivo.

## Cómo funciona
1. El dueño se registra gratis en ventasimple.app (sin tarjeta).
2. Descarga la app de escritorio (Windows 10/11).
3. Carga sus productos y empieza a vender.
4. El panel web muestra métricas, ventas, stock y clientes en tiempo real.
5. Todo se sincroniza automáticamente cuando hay internet.

## Funcionalidades principales
- **POS / Caja:** Punto de venta con cobros, cierre de caja, tickets.
- **Stock:** Control de inventario con alertas automáticas cuando un producto está por agotarse.
- **Reportes:** KPIs, heatmap de ventas, productos más vendidos, comparativas por período.
- **Clientes:** Historial de compras, datos de contacto, CRM básico.
- **Multi-PC:** Hasta 3 PCs sincronizadas en plan Pro.
- **Offline:** Funciona sin internet indefinidamente. Al volver la conexión sincroniza automáticamente.
- **Exportes:** PDF y CSV disponibles en planes Básico y Pro.
- **Add-ons:** Bot de WhatsApp y Detección con Cámaras IA (disponibles en Básico y Pro, consultar precio).

## Planes y precios
### Plan Gratis
- Precio: $0/mes
- Ventas y cobros básicos
- 1 dispositivo
- Historial últimos 30 días
- Sin sincronización en la nube
- Soporte por email

### Plan Básico — el más elegido
- Precio: $2.999/mes (pesos argentinos)
- Todo lo del plan Gratis
- Sincronización en la nube
- 1 PC conectada
- KPIs, reportes y heatmap
- Exportes PDF / CSV
- Soporte 24/7 por WhatsApp

### Plan Pro
- Precio: $4.499/mes (pesos argentinos)
- Para locales con más de 1 puesto o empleados
- Todo lo del plan Básico
- Hasta 3 PCs sincronizadas
- Análisis avanzado
- Soporte 24/7 prioritario
- Add-ons disponibles

## Soporte
- Soporte 24/7 por WhatsApp, incluso fines de semana, feriados y madrugadas.
- Tiempo de respuesta: menos de 5 minutos.
- Es soporte humano real, no un bot.
- Onboarding incluido sin costo adicional.
- En plan Pro el soporte es prioritario.

## Preguntas frecuentes
- **¿Funciona sin internet?** Sí, sin límite de tiempo offline. Al volver la conexión sincroniza todo automáticamente.
- **¿Es difícil migrar desde Excel?** No. Se pueden importar productos desde CSV. El equipo de soporte acompaña la migración sin costo.
- **¿Puedo cancelar?** Sí, en cualquier momento. Sin contratos anuales, sin cargos por cancelación. Suscripción mensual.
- **¿En qué Windows funciona?** Windows 10 y 11. El panel web funciona en cualquier navegador moderno desde cualquier dispositivo.
- **¿Cuánto tarda en estar listo?** Menos de 5 minutos: crear cuenta, descargar app, cargar productos y listo.
- **¿Necesito tarjeta de crédito para el plan Gratis?** No, para empezar gratis no se pide tarjeta.

## Datos de contacto
- Email ventas: ventas@ventasimple.app
- Para consultas sobre add-ons escribir a ventas@ventasimple.app
- Registro gratis: ventasimple.app/registro
- Descarga de la app: ventasimple.app/descargar

## Sobre la empresa
VentaSimple está pensado para dueños de negocios pequeños en Argentina que necesitan un sistema accesible, fácil y con soporte real. El enfoque diferencial es el soporte 24/7 humano.
`;

/* ─── RESPUESTAS DIRECTAS SIN API ──────────────────────────────────────── */
interface QuickAnswer { keywords: string[]; answer: string }

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    keywords: ["precio", "costo", "cuánto sale", "cuanto sale", "cuanto cuesta", "cuánto cuesta", "valor", "plan", "planes"],
    answer: "Los planes son:\n\n• **Gratis** — $0/mes: ventas básicas, 1 dispositivo, soporte por email.\n• **Básico** — $2.999/mes: sincronización en la nube, reportes, soporte 24/7 WhatsApp. El más elegido.\n• **Pro** — $4.499/mes: hasta 3 PCs, análisis avanzado, soporte prioritario.\n\nTodos los precios son en pesos argentinos. Podés empezar gratis sin tarjeta.",
  },
  {
    keywords: ["internet", "offline", "sin conexión", "sin conexion", "luz", "corte"],
    answer: "Sí, VentaSimple funciona **offline sin límite de tiempo**. Si se va internet o la luz (y tu PC tiene batería/UPS), seguís vendiendo con normalidad. Cuando vuelve la conexión, todo se sincroniza automáticamente — no se pierde nada.",
  },
  {
    keywords: ["cancelar", "contrato", "baja", "me voy", "dejar de usar"],
    answer: "Podés cancelar **en cualquier momento**. No hay contratos anuales ni cargos por cancelación. La suscripción es mensual y la manejás vos desde el panel.",
  },
  {
    keywords: ["soporte", "ayuda", "whatsapp", "problema", "responden", "atención", "atencion"],
    answer: "El soporte es **24/7 por WhatsApp**, con una persona real — no un bot. Respondemos en menos de 5 minutos, incluso fines de semana y feriados. En plan Pro tenés atención prioritaria.",
  },
  {
    keywords: ["windows", "pc", "computadora", "requisitos", "sistema operativo"],
    answer: "La app de escritorio funciona en **Windows 10 y 11**. El panel web (para ver métricas y datos) funciona en cualquier navegador moderno desde cualquier dispositivo, incluyendo celular o tablet.",
  },
  {
    keywords: ["migrar", "excel", "importar", "csv", "pasaje", "pasar datos"],
    answer: "Migrar es sencillo. Podés **importar productos desde un archivo CSV** en minutos. Si necesitás ayuda con la migración, el equipo de soporte te acompaña sin costo adicional.",
  },
  {
    keywords: ["gratis", "free", "tarjeta", "sin pagar", "probar"],
    answer: "Sí, el **plan Gratis es completamente gratis** y no pide tarjeta de crédito. Incluye ventas y cobros básicos en 1 dispositivo. Podés registrarte en menos de 5 minutos en ventasimple.app/registro.",
  },
  {
    keywords: ["multi pc", "varias pc", "múltiples pc", "varias computadoras", "dos pc", "tres pc", "2 pc", "3 pc"],
    answer: "Con el **plan Pro** podés tener **hasta 3 PCs sincronizadas** al mismo tiempo. Es ideal para negocios con múltiples puestos de caja o empleados.",
  },
  {
    keywords: ["stock", "inventario", "productos", "alerta", "agotarse"],
    answer: "VentaSimple controla el stock en tiempo real y envía **alertas automáticas** cuando un producto está por agotarse. Podés ver todo tu inventario desde el panel web o la app.",
  },
  {
    keywords: ["reporte", "métricas", "metrica", "ventas del día", "ventas del dia", "cuánto vendí", "cuanto vendi", "estadísticas", "estadisticas", "kpi"],
    answer: "Tenés acceso a **reportes completos**: KPIs, heatmap de ventas por horario, productos más vendidos, comparativas por período y más. En planes Básico y Pro podés exportar en PDF o CSV.",
  },
  {
    keywords: ["cliente", "clientes", "historial", "fidelizar", "contacto"],
    answer: "VentaSimple tiene un **CRM básico** para gestionar clientes: historial de compras, datos de contacto y seguimiento. Ideal para saber quiénes son tus mejores clientes.",
  },
  {
    keywords: ["whatsapp bot", "bot", "automatizar", "cámara", "camara", "ia", "add-on", "addon"],
    answer: "Hay dos add-ons disponibles en planes Básico y Pro:\n\n• **Bot de WhatsApp** — respondé consultas y tomá pedidos automáticamente.\n• **Cámaras IA** — conteo de personas, alertas de cola y reportes de afluencia.\n\nPara saber el precio, escribí a ventas@ventasimple.app.",
  },
  {
    keywords: ["instalar", "descargar", "bajar", "instalación", "instalacion", "exe", "setup"],
    answer: "Descargás el instalador (.exe) desde ventasimple.app/descargar. La instalación es sencilla y en menos de 5 minutos ya podés empezar a cargar tus productos.",
  },
  {
    keywords: ["registrar", "registro", "crear cuenta", "empezar", "alta"],
    answer: "Podés crear tu cuenta gratis en **ventasimple.app/registro**. No necesitás tarjeta. En menos de 5 minutos ya tenés todo listo para empezar.",
  },
  {
    keywords: ["contacto", "email", "hablar", "escribir", "comunicar"],
    answer: "Podés escribirnos a **ventas@ventasimple.app** para consultas sobre precios, add-ons o lo que necesites. Para soporte técnico, los clientes tienen WhatsApp 24/7.",
  },
];

/** Busca una respuesta rápida sin necesidad de API */
export function findQuickAnswer(question: string): string | null {
  const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const entry of QUICK_ANSWERS) {
    if (entry.keywords.some(k => q.includes(k.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))) {
      return entry.answer;
    }
  }
  return null;
}
