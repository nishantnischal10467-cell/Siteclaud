import { NextRequest, NextResponse } from "next/server";
import { generateAiFaqs, type FaqTone } from "@/lib/ai-faq-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const COUNTS = [1, 4, 7, 10] as const;
const TONES: FaqTone[] = ["approachable", "authoritative", "casual", "enthusiastic", "formal", "friendly", "funny", "neutral", "optimistic", "persuasive", "professional", "thoughtful"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-faq-generator:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const content = typeof payload?.content === "string" ? payload.content.slice(0, 2_000) : "";
  const count = COUNTS.includes(payload?.count) ? payload.count as 1 | 4 | 7 | 10 : 4;
  const language = typeof payload?.language === "string" && payload.language.trim() ? payload.language.slice(0, 80) : "English";
  const tone = TONES.includes(payload?.tone) ? payload.tone as FaqTone : "professional";

  try {
    const result = generateAiFaqs({ content, count, language, tone });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "FAQ generation failed." },
      { status: 400 },
    );
  }
}
