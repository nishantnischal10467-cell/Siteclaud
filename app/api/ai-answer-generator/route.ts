import { NextRequest, NextResponse } from "next/server";
import { generateAiAnswer, type AnswerTone } from "@/lib/ai-answer-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TONES: AnswerTone[] = ["approachable", "authoritative", "casual", "enthusiastic", "excited", "formal", "friendly", "funny", "informal", "innovative", "inspirational", "neutral", "optimistic", "persuasive", "pessimistic", "professional", "thoughtful"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-answer-generator:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const question = typeof payload?.question === "string" ? payload.question.slice(0, 1_500) : "";
  const language = typeof payload?.language === "string" && payload.language.trim() ? payload.language.slice(0, 80) : "English";
  const tone = TONES.includes(payload?.tone) ? payload.tone as AnswerTone : "professional";

  try {
    const result = generateAiAnswer({ question, language, tone });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Answer generation failed." },
      { status: 400 },
    );
  }
}
