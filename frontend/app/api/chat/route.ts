import { NextRequest, NextResponse } from "next/server";
import { findQuickAnswer, KNOWLEDGE_BASE } from "@/lib/chat-knowledge";

export const runtime = "edge";

const SYSTEM_PROMPT = `Sos el asistente de ventas de VentaSimple, un sistema de punto de venta para negocios pequeños en Argentina.

Tu objetivo: ayudar al usuario a entender el producto y llevarlo a probarlo.

Reglas:
- Respondé SIEMPRE en español argentino (vos/te), tono amigable y directo
- Respuestas cortas (máximo 4 líneas). Nunca párrafos largos
- Si te saludan ("hola", "buenas"), respondé con el saludo + preguntá en qué podés ayudar
- Siempre terminá sugiriendo un próximo paso concreto
- Nunca mandés al usuario a soporte salvo que sea una consulta técnica compleja post-compra
- Usá negritas para resaltar lo importante

Información del producto:
${KNOWLEDGE_BASE}`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json() as { message: string };
    if (!message?.trim()) {
      return NextResponse.json({ answer: "Escribí tu pregunta y te ayudo." });
    }

    // 1. Respuesta local sin API (rápido + gratis)
    const quick = findQuickAnswer(message);
    if (quick) {
      return NextResponse.json({ answer: quick, source: "local" });
    }

    // 2. Claude Haiku — ligero, rápido, orientado a conversión
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Fallback útil si no hay clave configurada
      return NextResponse.json({
        answer: "Buena pregunta. Para responderte bien, escribinos por WhatsApp o a **ventas@ventasimple.app** — respondemos en menos de 5 minutos.",
        source: "fallback",
      });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 220,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic ${res.status}`);

    const data = await res.json() as { content: { type: string; text: string }[] };
    const answer = data.content.find(b => b.type === "text")?.text
      ?? "No pude generar una respuesta. Escribinos a ventas@ventasimple.app.";

    return NextResponse.json({ answer, source: "ai" });

  } catch {
    return NextResponse.json({
      answer: "Algo falló de nuestro lado. Escribinos a **ventas@ventasimple.app** y te respondemos al toque.",
      source: "error",
    });
  }
}
