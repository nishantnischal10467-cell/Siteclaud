import { NextRequest, NextResponse } from "next/server";
import { generateAiLetter, type LetterTone, type LetterType } from "@/lib/ai-letter-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TYPES: LetterType[] = ["cover-letter", "business-letter", "thank-you-letter", "apology-letter", "recommendation-letter", "resignation-letter", "complaint-letter", "invitation-letter", "sales-letter", "personal-letter", "other"];
const TONES: LetterTone[] = ["approachable", "authoritative", "casual", "enthusiastic", "excited", "formal", "friendly", "funny", "informal", "innovative", "inspirational", "neutral", "optimistic", "persuasive", "pessimistic", "professional", "thoughtful"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-letter-generator:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const type = TYPES.includes(payload?.type) ? payload.type as LetterType : "business-letter";
  const description = typeof payload?.description === "string" ? payload.description.slice(0, 3_000) : "";
  const sender = typeof payload?.sender === "string" ? payload.sender.slice(0, 120) : "";
  const recipient = typeof payload?.recipient === "string" ? payload.recipient.slice(0, 120) : "";
  const language = typeof payload?.language === "string" && payload.language.trim() ? payload.language.slice(0, 80) : "English";
  const tone = TONES.includes(payload?.tone) ? payload.tone as LetterTone : "professional";

  try {
    const result = generateAiLetter({ type, description, sender, recipient, language, tone });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Letter generation failed." },
      { status: 400 },
    );
  }
}
