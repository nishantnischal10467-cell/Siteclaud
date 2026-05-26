import { NextRequest, NextResponse } from "next/server";
import { optimizeAiPrompt } from "@/lib/ai-prompt-optimizer";
import type { PromptFramework, PromptLength, PromptTone } from "@/lib/ai-prompt-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const FRAMEWORKS: PromptFramework[] = ["ape", "tag", "race", "care", "rise", "era", "create", "trace", "roses", "spark"];
const TONES: PromptTone[] = ["clear", "professional", "creative", "technical", "friendly", "academic", "persuasive", "strategic"];
const LENGTHS: PromptLength[] = ["concise", "detailed"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-prompt-optimizer:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const framework = FRAMEWORKS.includes(payload?.framework) ? payload.framework as PromptFramework : "ape";
  const tone = TONES.includes(payload?.tone) ? payload.tone as PromptTone : "clear";
  const length = LENGTHS.includes(payload?.length) ? payload.length as PromptLength : "detailed";
  const prompt = typeof payload?.prompt === "string" ? payload.prompt.slice(0, 5_000) : "";

  try {
    const result = optimizeAiPrompt({ framework, prompt, tone, length });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Prompt optimization failed." },
      { status: 400 },
    );
  }
}
