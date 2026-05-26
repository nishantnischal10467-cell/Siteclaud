import { NextRequest, NextResponse } from "next/server";
import { generateEmailResponse, type EmailTone } from "@/lib/ai-email-response-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TONES: EmailTone[] = ["approachable", "authoritative", "casual", "enthusiastic", "excited", "formal", "friendly", "funny", "informal", "innovative", "inspirational", "neutral", "optimistic", "persuasive", "pessimistic", "professional", "thoughtful"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-email-response-generator:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const receivedEmail = typeof payload?.receivedEmail === "string" ? payload.receivedEmail.slice(0, 4_000) : "";
  const subject = typeof payload?.subject === "string" ? payload.subject.slice(0, 200) : "";
  const responseGoal = typeof payload?.responseGoal === "string" ? payload.responseGoal.slice(0, 1_000) : "";
  const sender = typeof payload?.sender === "string" ? payload.sender.slice(0, 120) : "";
  const recipient = typeof payload?.recipient === "string" ? payload.recipient.slice(0, 120) : "";
  const language = typeof payload?.language === "string" && payload.language.trim() ? payload.language.slice(0, 80) : "English";
  const tone = TONES.includes(payload?.tone) ? payload.tone as EmailTone : "professional";

  try {
    const result = generateEmailResponse({ receivedEmail, subject, responseGoal, sender, recipient, language, tone });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Email response generation failed." },
      { status: 400 },
    );
  }
}
