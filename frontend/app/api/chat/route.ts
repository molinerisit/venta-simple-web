import { NextRequest, NextResponse } from "next/server";
import { findQuickAnswer, KNOWLEDGE_BASE } from "@/lib/chat-knowledge";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json() as { message: string };
    if (!message?.trim()) {
      return NextResponse.json({ answer: "Escribí tu pregunta y te ayudo." });
    }

    // 1. Intentar responder sin API
    const quick = findQuickAnswer(message);
    if (quick) {
      return NextResponse.json({ answer: quick, source: "local" });
    }

    // 2. Fallback a OpenAI solo si hay clave configurada
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        answer: "No encontré una respuesta directa para eso. Te recomiendo escribirnos a **ventas@ventasimple.app** o contactarnos por WhatsApp — respondemos en menos de 5 minutos.",
      });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 300,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `Sos el asistente de VentaSimple, un sistema de gestión para negocios pequeños en Argentina. Respondé de forma concisa, en español argentino informal (vos/te). Usá markdown básico (negritas, listas). Si la pregunta no está relacionada con el producto, redirigí amablemente. Basate SOLO en esta información:\n\n${KNOWLEDGE_BASE}`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) throw new Error("OpenAI error");
    const data = await res.json() as { choices: { message: { content: string } }[] };
    const answer = data.choices[0]?.message?.content ?? "No pude generar una respuesta. Escribinos a ventas@ventasimple.app.";

    return NextResponse.json({ answer, source: "ai" });
  } catch {
    return NextResponse.json({
      answer: "Hubo un problema al procesar tu pregunta. Escribinos a **ventas@ventasimple.app** y te respondemos enseguida.",
    });
  }
}
