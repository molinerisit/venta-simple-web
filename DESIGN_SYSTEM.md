VentaSimple — Design System + UI Refactor Spec
# VentaSimple — Design System + UI Refactor Spec

## Objetivo

Refinar la interfaz actual de VentaSimple para llevarla a un nivel visual y de producto más profesional, consistente y escalable, manteniendo intacta la lógica de negocio.

Este documento define:
- branding
- sistema visual
- tokens de diseño
- reglas de componentes
- ajustes UX por pantalla
- criterios de implementación
- prioridades de ejecución

---

# 1. Contexto del producto

VentaSimple es un sistema de gestión y ventas orientado a pequeños negocios.

Incluye:
- dashboard
- métricas
- productos
- clientes
- ventas
- cuenta / suscripción
- onboarding para instalación de app desktop

Debe transmitir:
- control
- simplicidad
- velocidad
- confiabilidad
- crecimiento del negocio

NO debe verse:
- genérico
- estudiantil
- recargado
- lleno de bordes innecesarios
- dependiente de un color violeta aleatorio sin relación con la marca

---

# 2. Objetivo del refactor

## Mantener
- estructura general
- navegación
- lógica funcional
- flujo actual
- componentes base si ya sirven

## Cambiar
- identidad visual
- consistencia cromática
- espaciado
- jerarquía tipográfica
- estados vacíos
- tarjetas
- botones
- sidebar
- inputs
- banners
- foco visual de cada pantalla

---

# 3. Branding oficial

## Carpeta de assets de marca

Los logos están en:

`/imagenesmarca`

Archivos:
- `/imagenesmarca/logo`
- `/imagenesmarca/logotexto`
- `/imagenesmarca/texto`

## Significado de cada asset

### logo
Solo ícono.
Uso:
- app icon
- favicon
- splash
- loader
- sidebar colapsado
- avatar institucional

### logotexto
Ícono + texto.
Uso:
- navbar principal
- login
- onboarding
- header del producto
- páginas institucionales internas

### texto
Solo palabra marca.
Uso:
- marketing
- piezas visuales
- composiciones donde el ícono ya aparece por separado

---

# 4. Reglas de uso del logo

## Producto / panel / desktop
Usar `logotexto` o `logo`
Con criterio serio y sobrio.

Regla:
- el producto usa principalmente azul como color estructural
- el naranja queda reservado como acento
- NO exagerar el naranja en toda la UI

## Marketing
Se puede usar versión más expresiva con “Simple” en naranja.

## Restricciones
- no aplicar sombras exageradas al logo
- no deformarlo
- no cambiar sus colores arbitrariamente
- no usarlo sobre fondos con bajo contraste
- no agregarle badges o efectos glow

---

# 5. Personalidad visual del sistema

La UI debe sentirse:
- limpia
- moderna
- confiable
- clara
- profesional
- utilitaria
- pensada para negocios reales

Inspiración visual:
- Stripe
- Shopify
- Mercado Pago
- Linear
- Vercel dashboard
- SaaS B2B moderno

No copiar estilos literalmente.
Tomar como referencia:
- espaciado
- limpieza
- claridad
- jerarquía
- sobriedad

---

# 6. Paleta oficial

## Brand colors

```ts
export const brandColors = {
  blue: "#1E3A8A",
  blueDark: "#0F172A",
  blueSoft: "#DBEAFE",
  orange: "#F97316",
  orangeSoft: "#FFEDD5",
};
Neutral colors
export const neutralColors = {
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  border: "#E5E7EB",
  borderStrong: "#CBD5E1",
  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
};
Semantic colors
export const semanticColors = {
  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  info: "#2563EB",
  infoSoft: "#DBEAFE",
};
7. Regla de color global
Azul

Rol:

estructura
navegación
identidad principal
foco
botones principales
links importantes
gráficas
Naranja

Rol:

acento
upgrade
crecimiento
highlights específicos
estados promocionales
CTA secundarios de negocio
Prohibición

Eliminar el violeta actual como color dominante del sistema.
Puede quedar solo si hay una razón muy concreta, pero la meta es migrar la UI al branding real de VentaSimple.

8. Sistema tipográfico

Fuente principal:

Inter

Fallback:

system-ui, sans-serif
Escala sugerida
export const typography = {
  h1: {
    fontSize: "36px",
    lineHeight: "44px",
    fontWeight: 700,
  },
  h2: {
    fontSize: "30px",
    lineHeight: "38px",
    fontWeight: 700,
  },
  h3: {
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: 700,
  },
  h4: {
    fontSize: "20px",
    lineHeight: "28px",
    fontWeight: 600,
  },
  bodyLg: {
    fontSize: "18px",
    lineHeight: "28px",
    fontWeight: 400,
  },
  body: {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 400,
  },
  bodySm: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 400,
  },
  label: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 500,
  },
  caption: {
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 500,
  },
};
Regla de jerarquía

Cada pantalla debe respetar:

Título principal
Subtítulo/contexto
Área de acción
Contenido
Estados secundarios
9. Espaciado y layout
Escala base
export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
};
Reglas
padding interno de cards: mínimo 20px, ideal 24px
separación vertical entre bloques: mínimo 24px
títulos y subtítulos deben respirar
evitar layouts apretados
evitar bordes pegados sin aire
10. Radios, sombras y bordes
Border radius
export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  full: "9999px",
};
Border

Usar borde suave:

1px solid #E5E7EB
Sombras

Muy sutiles o ninguna.

export const shadows = {
  sm: "0 1px 2px rgba(15, 23, 42, 0.04)",
  md: "0 4px 12px rgba(15, 23, 42, 0.06)",
};

Regla:

no usar sombras fuertes de estilo template
mejor aire que sombra
11. Tailwind config sugerido

Si el proyecto usa Tailwind, aplicar esto como base:

// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1E3A8A",
          "blue-dark": "#0F172A",
          "blue-soft": "#DBEAFE",
          orange: "#F97316",
          "orange-soft": "#FFEDD5",
        },
        neutral: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          "surface-alt": "#F1F5F9",
          border: "#E5E7EB",
          "border-strong": "#CBD5E1",
          text: "#0F172A",
          "text-secondary": "#64748B",
          muted: "#94A3B8",
        },
        semantic: {
          success: "#16A34A",
          "success-soft": "#DCFCE7",
          warning: "#D97706",
          "warning-soft": "#FEF3C7",
          danger: "#DC2626",
          "danger-soft": "#FEE2E2",
          info: "#2563EB",
          "info-soft": "#DBEAFE",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(15, 23, 42, 0.04)",
        md: "0 4px 12px rgba(15, 23, 42, 0.06)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
12. Componentes base
12.1 AppShell

Debe existir una estructura consistente:

sidebar fija
header implícito o top actions por pantalla
main content con ancho máximo razonable
mucho aire en escritorio
12.2 Sidebar
Problema actual

La sidebar actual se siente funcional, pero visualmente genérica y todavía demasiado cercana a dashboard template básico.

Objetivo

Hacerla más sobria, clara y de marca.

Reglas
fondo: neutral.surface-alt
borde derecho suave
logo arriba bien presentado
nombre del negocio con mejor jerarquía
plan actual con card más prolija
item activo con:
fondo brand.blue-soft
texto brand.blue
icono brand.blue
item inactivo:
texto neutral.textSecondary
hover suave sobre neutral.surface
NO hacer
usar violeta como activo
badges “PRO” gritones
demasiada saturación visual
12.3 Cards

Todas las cards deben compartir:

fondo blanco
borde suave
radio 16px
padding 24px
separación correcta entre header y contenido
Variantes
default
highlight
warning
premium
Premium card

Para upsell o plan recomendado:

borde azul suave
fondo blanco
badge recomendado con brand.orangeSoft o brand.blueSoft
CTA claro
12.4 Botones
PrimaryButton

Uso:

acción principal de pantalla

Estilo:

fondo brand.blue
texto blanco
hover brand.blueDark
focus ring azul suave
altura cómoda
border radius pill o md según contexto
SecondaryButton

Uso:

acciones secundarias

Estilo:

fondo blanco
borde neutral.border
texto neutral.text
hover neutral.surface-alt
AccentButton

Uso:

upgrade
acciones de monetización
CTA promocional puntual

Estilo:

fondo brand.orange
texto blanco
hover más oscuro
usar poco
GhostButton

Uso:

acciones discretas
12.5 Inputs

Todos los inputs deben unificarse.

Reglas
altura consistente
padding horizontal generoso
borde gris suave
placeholder gris medio
focus azul
fondo blanco
Evitar
bordes muy marcados
sombras exageradas
outline violeta
12.6 Selects

Mismas reglas que inputs.
El icono de dropdown debe ser discreto.

12.7 EmptyState

Esto es crítico.

Hoy hay demasiados “Sin resultados” o “Sin datos” secos.
Eso baja muchísimo la percepción de producto.

Todo estado vacío debe incluir:
icono
título
explicación breve
CTA o siguiente acción
Ejemplos
Productos vacío

Título:
Todavía no cargaste productos

Texto:
Creá tu primer producto para empezar a registrar ventas y llevar stock.

CTA:
Crear producto

Clientes vacío

Título:
Todavía no tenés clientes

Texto:
Cuando agregues clientes vas a poder registrar compras, deuda y seguimiento.

CTA:
Crear cliente

Métricas vacío

Título:
Todavía no hay actividad para mostrar

Texto:
Cuando registres ventas, acá vas a ver evolución, ticket promedio y productos más vendidos.

CTA:
Ir a ventas

12.8 Banners / alerts

Los banners deben ser más claros y menos template.

Warning banner
fondo semantic.warningSoft
borde warning suave
icono claro
mensaje corto
CTA alineado a la derecha
Premium banner
fondo brand.orangeSoft
acento naranja
CTA Upgrade
12.9 Badges

Usar badges con moderación.

Tipos:

plan
recomendado
pro
estado

Estilo:

pequeño
rounded full
colores suaves
12.10 KPI cards

Para dashboard y métricas.

Estructura
label arriba
valor grande
contexto abajo
icono sutil a la derecha
Regla

Una KPI card principal puede destacarse, pero no todas deben competir entre sí.

12.11 Charts

Los charts deben usar el azul de marca como color principal.
Los datos secundarios pueden usar azul suave o neutros.
El naranja solo debe aparecer como highlight puntual.

13. Pantallas y ajustes específicos
13.1 Dashboard
Problema

La pantalla se siente demasiado liviana y parcialmente vacía.
El onboarding está bien orientado, pero visualmente puede elevarse bastante.

Objetivo

Que el dashboard transmita:

bienvenida
control inicial
progreso
siguiente acción
Ajustes
convertir el bloque principal en hero card más sólida
mejorar la jerarquía de título/subtítulo
hacer el icono principal más institucional
darle más peso a la acción principal
usar una barra o indicador de progreso del onboarding
destacar el paso actual
cada paso debe verse como step real, no solo bloque genérico
CTA sugeridas
Descargar app
Activar desktop
Registrar primera venta
13.2 Mi cuenta / planes
Problema

La pantalla cumple, pero se siente genérica y algo fría.

Objetivo

Mejorar:

claridad del estado actual
percepción de valor de los planes
legibilidad del CTA de upgrade
Ajustes
separar mejor:
estado suscripción
estado desktop
comparación de planes
hacer el plan recomendado claramente superior, pero elegante
mejorar el contraste del plan gratis
usar naranja solo para acentuar monetización, no para todo
Card del plan recomendado
borde azul
badge “Recomendado”
CTA principal claro
mayor aire interno
13.3 Métricas
Problema

Hoy la vista se percibe vacía y con gráfico muerto.

Objetivo

Que se sienta como un área real de análisis, incluso cuando aún no hay datos.

Ajustes
rediseñar estado vacío del gráfico
usar ilustración o icono sutil
explicar qué aparecerá ahí cuando haya ventas
mejorar segment control de rango temporal
cards KPI más consistentes
contenedores inferiores con empty states reales
Cuando haya datos
línea principal azul
tooltips limpios
grid suave
leyendas mínimas
13.4 Productos
Problema

Demasiado desnuda y sin guía.
La acción “Nuevo” está, pero el vacío no ayuda.

Objetivo

Guiar al usuario a cargar su primer producto.

Ajustes
transformar el gran vacío en EmptyState completo
botón “Nuevo producto” más claro
mejor alineación entre búsqueda, filtro y CTA
dar más jerarquía al título y contador
Copy sugerido

Título:
Todavía no cargaste productos

Texto:
Creá tu primer producto para empezar a vender, controlar stock y ver métricas.

CTA:
Crear producto

13.5 Clientes
Problema

La restricción por plan existe, pero se presenta de forma algo tosca.

Objetivo

Que el bloqueo premium se entienda rápido y sin sentirse improvisado.

Ajustes
banner superior más profesional
icono lock o crown
copy más directo
CTA de upgrade más notorio
el estado vacío no debe competir con el banner
deshabilitar controles pagos con claridad y elegancia
Copy sugerido

Título:
Clientes disponible en planes pagos

Texto:
En el plan gratuito podés ver clientes sincronizados desde la app. Para crear, editar y gestionar deuda desde el panel web necesitás un plan pago.

CTA:
Ver planes

13.6 Sidebar / identidad institucional
Problema

La parte superior con el negocio y plan necesita más presencia.

Ajustes
mejorar composición del bloque de negocio
reemplazar el avatar “VS” si corresponde por el logo o una variante consistente
plan actual con mejor diseño de card
botón de upgrade más alineado al branding oficial
14. Experiencia de marca entre landing y panel

El panel debe sentirse hijo directo de la landing, no otro producto.

Según las capturas del PDF de la landing, la comunicación actual ya tiene:

azul dominante
layout limpio
propuesta clara
métricas comerciales visibles
secciones sobrias
énfasis en simplicidad y operación rápida

Por eso, el panel debe alinearse con esa misma lógica:

menos violeta
más azul real de marca
más espacio
más sobriedad
monetización más elegante
15. Accesibilidad mínima

Aplicar:

contraste suficiente
foco visible
targets clickeables cómodos
textos secundarios no demasiado lavados
botones deshabilitados entendibles
16. Microinteracciones

Agregar solo donde sumen:

hover suave
transiciones cortas
focus claro
cards con cambio sutil al hover
botones con feedback elegante

Evitar:

animaciones llamativas
rebotes
efectos innecesarios

Duración sugerida:

150ms a 220ms
17. Modo oscuro

Si existe o va a existir:

no improvisarlo aún si complica
primero consolidar el sistema claro
luego derivar tokens oscuros coherentes

No resolver dark mode con simples inversiones automáticas.

18. Prioridad de implementación
Fase 1 — Foundation
reemplazar paleta actual por paleta oficial
tipografía Inter
unificar radios, borders, spacing
actualizar botones, inputs y sidebar
integrar logos correctos
Fase 2 — Pantallas principales
dashboard
mi cuenta / planes
productos
clientes
métricas
Fase 3 — Estados especiales
empty states
banners
premium states
loading states
skeletons si aplica
19. Criterios de aceptación

El trabajo se considera bien hecho si:

toda la UI se siente parte de una misma marca
desaparece el violeta como color dominante
el panel se ve más premium sin perder claridad
los estados vacíos guían mejor
el upgrade se ve mejor integrado
el sistema se percibe más serio y valioso
no se rompe ninguna funcionalidad existente
20. Instrucciones concretas para implementar
Auditar todos los estilos globales actuales
Reemplazar variables de color existentes por tokens oficiales
Unificar componentes base antes de tocar pantallas
Aplicar refactor pantalla por pantalla
Revisar coherencia visual final completa
Entregar código listo, no solo sugerencias
21. Pedido final

Quiero que implementes este refactor visual respetando la estructura del proyecto actual.

No quiero solo propuestas.
Quiero cambios reales en código, consistentes, limpios y reutilizables.

En caso de duda:

priorizar claridad
priorizar sobriedad
priorizar coherencia con la marca
no introducir adornos innecesarios

# 22. Enforcement (OBLIGATORIO)

Este documento NO es una guía.

Es la fuente de verdad del sistema de diseño.

## Reglas obligatorias:

1. Cualquier estilo que contradiga este documento debe eliminarse
2. El color violeta debe eliminarse completamente del sistema
3. Todos los componentes deben migrar a los tokens definidos
4. No se permite mantener estilos previos por compatibilidad visual
5. Si hay conflicto entre el código actual y este documento:
   → gana este documento

## Definición de DONE:

El trabajo NO está completo si:

- sigue existiendo violeta en la UI
- los botones no usan brand.blue
- los empty states no están implementados
- la sidebar no fue rediseñada
- los tokens no fueron aplicados globalmente

## Output esperado:

Claude debe devolver:

1. Lista de archivos modificados
2. Cambios en Tailwind config
3. Componentes refactorizados
4. Ejemplos de pantallas actualizadas
5. Confirmación explícita de eliminación de estilos anteriores