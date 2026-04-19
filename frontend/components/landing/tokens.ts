import { TrendingDown, Clock, PhoneOff, BarChart2, MessageSquare, UserCheck, Rocket } from "lucide-react";

export const PRICE_BASIC = 2999;
export const PRICE_PRO   = 4499;

export const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

export const C = {
  bg:         "#F8F7F4",
  bgAlt:      "#EDECE8",
  surface:    "#FFFFFF",
  border:     "#E2E0DA",
  text:       "#1A1816",
  muted:      "#706B65",
  light:      "#A39D97",
  blue:       "#1E3A8A",
  blueDark:   "#162D70",
  blueBg:     "#EEF2FE",
  orange:     "#F97316",
  orangeDark: "#EA6C00",
  orangeBg:   "#FFF7ED",
  orangeBdr:  "#FED7AA",
  green:      "#0A6E45",
  greenBg:    "#ECFDF5",
  greenBdr:   "#A7F3D0",
  heroBg:     "#0B1D3F",
};

export const T = {
  display: { fontSize: "clamp(42px, 5.2vw, 68px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.04em", color: C.text } as React.CSSProperties,
  h2:      { fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 900, lineHeight: 1.12, letterSpacing: "-0.03em", color: C.text } as React.CSSProperties,
  h3:      { fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: C.text } as React.CSSProperties,
  label:   { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.light } as React.CSSProperties,
  body:    { fontSize: 15, lineHeight: 1.75, color: C.muted } as React.CSSProperties,
  small:   { fontSize: 13, lineHeight: 1.65, color: C.muted } as React.CSSProperties,
};

export const PROBLEMS = [
  { icon: Clock,        text: "Buscás el precio a mano mientras el cliente espera — y la fila crece" },
  { icon: TrendingDown, text: "Cerrar la caja te lleva 40 minutos con calculadora y nunca cierra exacto" },
  { icon: PhoneOff,     text: "Se va internet y el sistema para — la venta también" },
  { icon: BarChart2,    text: "Al final del día no sabés cuánto ganaste hasta que hacés las cuentas a mano" },
];

export const SUPPORT_CARDS = [
  { icon: MessageSquare, title: "< 5 min de respuesta", desc: "Por WhatsApp con alguien que conoce el sistema." },
  { icon: Clock,         title: "24/7/365",              desc: "Fines de semana, feriados, a la madrugada." },
  { icon: UserCheck,     title: "Soporte humano",        desc: "Una persona real que entiende tu problema." },
  { icon: Rocket,        title: "Onboarding incluido",   desc: "Te ayudamos a configurar todo desde el primer día." },
];
