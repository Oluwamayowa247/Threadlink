import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import { getSuppliers } from "@/lib/supplier-data";

type Match = { slug: string; name: string; reason: string };

function fallbackMatch(prompt: string, suppliers: { slug: string; name: string; fabrics: string[]; city: string; country: string; moq: number }[]): Match[] {
  const q = prompt.toLowerCase();
  const scored = suppliers.map((s) => {
    let score = 0;
    for (const f of s.fabrics) if (q.includes(f.toLowerCase())) score += 3;
    if (q.includes("silk") && s.fabrics.some((f) => f.toLowerCase().includes("silk"))) score += 4;
    if (q.includes("linen") && s.fabrics.some((f) => f.toLowerCase().includes("linen"))) score += 4;
    if (q.includes("lace") && s.fabrics.some((f) => f.toLowerCase().includes("lace"))) score += 4;
    if (q.includes("low moq") || q.includes("small moq") || q.includes("small batch")) {
      score += Math.max(0, 120 - s.moq) / 40;
    }
    return { s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(({ s }, idx) => ({
    slug: s.slug,
    name: s.name,
    reason:
      idx === 0
        ? `Strong fabric fit (${s.fabrics.slice(0, 3).join(", ")}), and workable MOQ (${s.moq}).`
        : `Good option for ${s.fabrics.slice(0, 2).join(" + ")} with delivery-friendly location (${s.city}).`,
  }));
}

export async function POST(req: Request) {
  const { prompt, activeSlug } = (await req.json().catch(() => ({}))) as {
    prompt?: string;
    activeSlug?: string;
  };

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 6) {
    return NextResponse.json(
      { error: "Missing prompt" },
      { status: 400 },
    );
  }

  const suppliers = await getSuppliers();
  const small = suppliers.map((s) => ({
    slug: s.slug,
    name: s.name,
    city: s.city,
    country: s.country,
    fabrics: s.fabrics,
    moq: s.moq,
    pricePerYardUsd: s.pricePerYardUsd,
    rating: s.rating,
    responseTimeHours: s.responseTimeHours,
  }));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      matches: fallbackMatch(prompt, small),
      note: "Using fallback matcher (set ANTHROPIC_API_KEY for real Claude output).",
    });
  }

  const client = new Anthropic({ apiKey });

  const system = [
    "You are a sourcing assistant for fashion designers.",
    "Given a list of suppliers and a designer request, choose the top 3 matching suppliers.",
    "Return ONLY valid JSON with this shape:",
    '{ "matches": [{ "slug": string, "name": string, "reason": string }] }',
    "Reasons should be concise (1–2 sentences) and mention fabrics, MOQ, and response time when relevant.",
  ].join("\n");

  const user = {
    request: prompt,
    activeSupplierSlug: activeSlug ?? null,
    suppliers: small,
  };

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      temperature: 0.2,
      system,
      messages: [
        {
          role: "user",
          content: JSON.stringify(user),
        },
      ],
    });

    const text = msg.content
      .map((c) => ("text" in c ? c.text : ""))
      .join("")
      .trim();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const jsonStr =
      jsonStart >= 0 && jsonEnd > jsonStart ? text.slice(jsonStart, jsonEnd + 1) : text;

    const parsed = JSON.parse(jsonStr) as { matches?: Match[] };
    const matches = Array.isArray(parsed.matches) ? parsed.matches.slice(0, 3) : [];

    if (matches.length === 0) {
      return NextResponse.json({ matches: fallbackMatch(prompt, small) });
    }

    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json({ matches: fallbackMatch(prompt, small) });
  }
}

