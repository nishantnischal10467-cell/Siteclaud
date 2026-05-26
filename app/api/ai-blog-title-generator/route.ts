import { NextRequest, NextResponse } from "next/server";
import { generateBlogTitles, type BlogTitleTone } from "@/lib/ai-blog-title-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TONES: BlogTitleTone[] = ["approachable", "authoritative", "casual", "enthusiastic", "excited", "formal", "friendly", "funny", "informal", "innovative", "inspirational", "neutral", "optimistic", "persuasive", "pessimistic", "professional", "thoughtful"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-blog-title-generator:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const keywords = typeof payload?.keywords === "string" ? payload.keywords.slice(0, 500) : "";
  const summary = typeof payload?.summary === "string" ? payload.summary.slice(0, 2_000) : "";
  const audience = typeof payload?.audience === "string" ? payload.audience.slice(0, 500) : "";
  const language = typeof payload?.language === "string" && payload.language.trim() ? payload.language.slice(0, 80) : "English";
  const tone = TONES.includes(payload?.tone) ? payload.tone as BlogTitleTone : "professional";

  try {
    const result = generateBlogTitles({ keywords, summary, audience, language, tone });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Blog title generation failed." },
      { status: 400 },
    );
  }
}
