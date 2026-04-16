# VentaSimple — Design System V3
## Sistema de producto, conversión y operación

---

# 0. Fuente de verdad

Este documento es la fuente de verdad del sistema visual de VentaSimple.

NO es una guía.
NO es una inspiración.
NO es una lista de ideas.

Es el contrato de implementación.

Si el código actual contradice este documento:
→ gana este documento.

---

# 1. Objetivo real del producto

VentaSimple no es una startup visual.
VentaSimple es una herramienta para que un negocio venda más, se equivoque menos y tenga control.

La interfaz debe comunicar:

- control
- rapidez
- claridad
- confianza
- soporte real
- negocio serio

NO debe comunicar:

- dashboard template
- SaaS genérico
- “startup linda”
- interfaz decorada sin criterio
- exceso de bloques sin jerarquía

---

# 2. Diagnóstico del estado actual

## 2.1 Landing actual
Problemas detectados:

- estructura correcta pero demasiado genérica
- hero con buena intención pero todavía “template SaaS”
- demasiadas secciones con el mismo peso
- features poco memorables
- pricing demasiado estándar
- exceso de neutralidad en bloques medios
- iconografía inconsistente
- responsive previamente roto y con riesgo de volver a romperse

## 2.2 Dashboard actual
Problemas detectados:

- onboarding útil pero visualmente débil
- demasiados bloques livianos
- falta de sensación de “centro de control”
- sidebar correcta pero todavía poco institucional
- accesos rápidos compiten con el contenido principal
- la UI se ve “bien” pero no transmite suficiente autoridad

---

# 3. Principio rector

## Regla central
VentaSimple debe verse como:

> “el sistema serio para manejar un negocio real”

No como:
- una landing bonita
- un kit UI premium
- un template de admin panel

---

# 4. Estrategia visual general

## 4.1 Estilo
El sistema debe ser:

- sobrio
- claro
- compacto
- utilitario
- moderno
- profesional

## 4.2 Referencia conceptual
La referencia NO es “copiar una landing”.

La referencia es una mezcla de:
- claridad comercial de AgendaPro
- estructura limpia de Calendly
- contundencia visual de Stripe
- disciplina de producto de Linear

## 4.3 Traducción para VentaSimple
Eso significa:

- hero fuerte
- CTA claro
- métricas concretas
- features resumidas
- dashboard operativo
- soporte visible
- pricing entendible
- menos ornamento

---

# 5. Paleta oficial

## 5.1 Colores de marca

```ts
export const colors = {
  primary: "#1E3A8A",
  primaryDark: "#0B1F4D",
  primarySoft: "#DBEAFE",

  accent: "#F97316",
  accentDark: "#EA580C",
  accentSoft: "#FFEDD5",

  bg: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceAlt: "#F3F4F6",
  border: "#E5E7EB",
  borderStrong: "#CBD5E1",

  text: "#111827",
  textSoft: "#6B7280",
  textMuted: "#9CA3AF",

  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
};
5.2 Regla de color
azul = estructura, confianza, navegación, producto
naranja = acción, monetización, CTA, acento puntual
verde = soporte, éxito, estado correcto
neutros = respiración visual
5.3 Prohibiciones
violeta eliminado completamente
no usar naranja en grandes masas salvo CTA
no usar azul oscuro como bloque dominante en todo el producto
no usar glow exagerado
no usar gradientes si no cumplen una función concreta
6. Tipografía
6.1 Fuente
Inter
fallback: system-ui, sans-serif
6.2 Escala tipográfica
export const typography = {
  displayXL: { fontSize: "64px", lineHeight: "1.02", fontWeight: 900 },
  displayLG: { fontSize: "52px", lineHeight: "1.04", fontWeight: 900 },
  h1:        { fontSize: "40px", lineHeight: "1.08", fontWeight: 800 },
  h2:        { fontSize: "32px", lineHeight: "1.12", fontWeight: 800 },
  h3:        { fontSize: "24px", lineHeight: "1.20", fontWeight: 700 },
  h4:        { fontSize: "18px", lineHeight: "1.30", fontWeight: 700 },
  bodyLG:    { fontSize: "18px", lineHeight: "1.70", fontWeight: 400 },
  body:      { fontSize: "16px", lineHeight: "1.70", fontWeight: 400 },
  bodySM:    { fontSize: "14px", lineHeight: "1.65", fontWeight: 400 },
  label:     { fontSize: "12px", lineHeight: "1.40", fontWeight: 700 },
  caption:   { fontSize: "11px", lineHeight: "1.40", fontWeight: 600 },
};
6.3 Regla

La landing vende.
El dashboard guía.
La tipografía debe seguir eso.

7. Sistema de iconografía
7.1 Librería obligatoria

Se usará exclusivamente:

Minimal Ecommerce — Lineal

7.2 Estilo
lineal / outline
bordes redondeados
stroke consistente
sin rellenos pesados
sin ilustraciones
7.3 Reglas
no mezclar con otros packs
no mezclar outline con solid
no usar iconos decorativos por rellenar espacio
todos los iconos deben parecer parte del mismo sistema
7.4 Tamaños
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
};
7.5 Uso por contexto
sidebar: 20
botones: 16 o 20
cards: 24
empty states: 32
secciones landing: 24 o 32
7.6 Regla de jerarquía

El icono acompaña.
No protagoniza.
Si el usuario recuerda el icono pero no el mensaje, falló.

8. Espaciado, radios y bordes
8.1 Espaciado base
export const spacing = {
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
  20: "80px",
  24: "96px",
};
8.2 Radios
export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  pill: "9999px",
};
8.3 Bordes
suaves
1px sólido
no usar divisiones de más
usar borde para estructura, no para decorar
8.4 Sombras

Muy pocas.

export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.04)",
  md: "0 4px 12px rgba(0,0,0,0.06)",
  lg: "0 12px 28px rgba(0,0,0,0.08)",
};

Regla:

mejor aire que sombra
sombra solo para separación útil
9. Sistema de componentes
9.1 Buttons
Primary

Uso:

CTA principal
acción de negocio
acción clave de pantalla

Estilo:

fondo primary
texto blanco
hover primaryDark
Accent

Uso:

monetización
CTA de registro
CTA final de landing

Estilo:

fondo accent
texto blanco
Secondary

Uso:

acción secundaria
ver demo
navegar

Estilo:

fondo blanco o surface
borde suave
texto oscuro
Ghost

Uso:

acciones discretas
Regla

No más de un botón visualmente dominante por bloque.

9.2 Cards

Tipos:

default
highlight
action
empty state
premium

Reglas:

padding 24
radio 16
fondo limpio
borde suave
sin ruido visual
9.3 Inputs / Selects
altura consistente
padding cómodo
focus azul
placeholder gris medio
nada violeta
nada apretado
9.4 Empty states

Todo empty state debe tener:

icono
título
explicación
acción

Nunca:

“Sin datos”
“Sin resultados”
a secas
9.5 KPI cards

Estructura:

label
valor
contexto
icono sutil

Regla:
Una sola puede destacar fuerte.
No todas.

10. Landing — sistema de conversión
10.1 Objetivo

La landing debe responder en segundos:

qué es
para quién
por qué confiar
qué hacer ahora
10.2 Estructura obligatoria
Hero

Debe incluir:

promesa clara
subtítulo concreto
CTA principal
CTA secundaria
screenshot real
3 beneficios de baja fricción
Prueba social

Máximo 3 métricas fuertes.

Problema

Bloque corto e incómodo:

errores
stock
pérdida de plata
falta de control
Solución

Máximo 4 features.

Cómo funciona

3 pasos, una sola vez.

Soporte

Debe aparecer antes de pricing.

Testimonios

Máximo 3.

Pricing

Máximo 3 planes.
Uno destacado.

FAQ

Corta.
Enfocada a objeciones.

CTA final

Fuerte.
Simple.
Sin texto redundante.

11. Landing — reglas de contenido
11.1 Hero

La promesa debe ser comercial, no poética.

Formato recomendado:

verbo fuerte
resultado claro
sin palabras vacías

Ejemplo de dirección:
“Vendé rápido, controlá stock y mirá tu negocio en un solo lugar.”

11.2 CTA

El CTA principal debe ser siempre uno de estos:

Empezar gratis
Crear cuenta gratis
Probar gratis

No inventar variantes innecesarias.

11.3 Beneficios del hero

Máximo 3:

sin tarjeta
listo en minutos
cancelás cuando querés
11.4 Problema

No más de 6 items.
Ideal: 4.

11.5 Features

No más de 4.
Cada una:

icono
título corto
una línea clara

No hacer listas largas como inventario técnico.

11.6 Pricing

El plan recomendado debe verse claramente superior, pero sin exageración visual.
La comparación debe ser entendible en 10 segundos.

12. Landing — reglas visuales
12.1 Hero
fondo oscuro permitido, pero controlado
el mockup debe verse real y creíble
no usar glow excesivo
no usar naranja en texto largo
naranja solo para CTA o highlight muy puntual
12.2 Métricas
pocas
grandes
concretas
sin parecer contador decorativo
12.3 Features
visualmente resumidas
menos texto
más escaneo
12.4 Secciones

Cada sección debe tener una razón clara para existir.
Si no empuja conversión, se elimina.

13. Dashboard — sistema operativo
13.1 Objetivo

El dashboard debe sentirse como:

centro de control del negocio

No como:

checklist
card list
onboarding blando
13.2 Estructura deseada

Arriba:

saludo
contexto
fecha o estado

Centro:

bloque principal de progreso / setup
acción actual dominante

Secundario:

accesos rápidos
soporte
estado de sincronización
13.3 Bloque principal

Debe responder:

qué falta
qué sigue
cuánto avance hay
qué acción tengo que tomar ahora
13.4 Pasos

Usar estructura tipo timeline o progress stack.
No tarjetas blandas sin tensión.

13.5 Accesos rápidos

Deben existir, pero subordinados al flujo principal.
No competir con el bloque central.

13.6 Sidebar

Debe ser:

clara
compacta
institucional
poco dramática

No:

azul noche exagerado
demasiado gris muerto
estilo gaming / template
14. Dashboard — reglas visuales
14.1 Sidebar
fondo surface o surfaceAlt
activo con primarySoft
texto activo primary
icono activo primary
inactivos gris medio
14.2 Progreso
barra clara
porcentaje visible
estado real
siguiente acción clara
14.3 Jerarquía

Debe haber:

un foco principal
una acción principal
un flujo lógico

No todo al mismo peso.

15. Responsive (OBLIGATORIO)
15.1 Regla principal

No se reduce.
Se reorganiza.

15.2 Landing
Desktop
texto izquierda
mockup derecha
Tablet
texto arriba
mockup abajo
Mobile
texto
CTA
beneficios
mockup
métricas en grid
nada cortado
15.3 Dashboard
Desktop
sidebar lateral
contenido principal
secundario a la derecha si corresponde
Tablet/Mobile
sidebar colapsable
contenido en una sola columna
accesos rápidos debajo
no mantener layout desktop comprimido
15.4 Prohibiciones
overflow horizontal
mockup roto
métricas en fila comprimida
texto aplastado
bloques cortados
16. Accesibilidad mínima
contraste suficiente
foco visible
targets cómodos
hover sutil
estados disabled claros
tamaño de texto legible
17. Microinteracciones

Permitido:

hover
focus
transición corta
feedback de botón

Prohibido:

rebotes
motion decorativo
efectos “wow” gratuitos

Duración:
150–220ms

18. Lo que queda prohibido
violeta
mezclar icon packs
hero con copy ambiguo
features largas
glow fuerte
cards por decorar
dashboards dark exagerados
pricing plantilla SaaS genérica
empty states secos
responsive por simple escalado
19. Prioridad de implementación
Fase 1
colores
tipografía
iconos
botones
cards
inputs
sidebar
Fase 2
landing completa
hero
responsive
features
pricing
FAQ
Fase 3
dashboard
onboarding
empty states
métricas
productos
clientes
ventas
20. Definition of Done

El trabajo NO está completo si:

la landing sigue pareciendo template
el dashboard no transmite control
quedan restos violeta
se mezclan iconos
mobile está roto
features son demasiadas
el CTA principal compite con otros
el onboarding no guía
hay bloques sin jerarquía
21. Output obligatorio para Claude

Claude debe devolver:

lista de archivos modificados
qué componentes fueron reemplazados
qué estilos globales fueron eliminados
cómo resolvió responsive
confirmación de eliminación total de estilos anteriores que contradicen este documento

No entregar sugerencias.
No entregar “ideas”.
Entregar código.

22. Enforcement final

Este documento tiene prioridad absoluta.

Si existe conflicto entre:

el diseño actual
el código actual
estilos heredados
componentes previos

→ gana este documento.

No se permite mantener UI previa “porque ya estaba hecha”.

La implementación correcta reemplaza lo que haya que reemplazar.


---
