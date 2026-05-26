import { NextRequest, NextResponse } from "next/server";
import { generateAiPrompt, type PromptFramework, type PromptLength, type PromptTone } from "@/lib/ai-prompt-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const FRAMEWORKS: PromptFramework[] = ["ape", "tag", "race", "care", "rise", "era", "create", "trace", "roses", "spark"];
const TONES: PromptTone[] = ["clear", "professional", "creative", "technical", "friendly", "academic", "persuasive", "strategic"];
const LENGTHS: PromptLength[] = ["concise", "detailed"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-prompt-generator:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const framework = FRAMEWORKS.includes(payload?.framework) ? payload.framework as PromptFramework : "ape";
  const tone = TONES.includes(payload?.tone) ? payload.tone as PromptTone : "clear";
  const length = LENGTHS.includes(payload?.length) ? payload.length as PromptLength : "concise";
  const task = typeof payload?.task === "string" ? payload.task.slice(0, 2_000) : "";
  const goal = typeof payload?.goal === "string" ? payload.goal.slice(0, 1_500) : "";
  const context = typeof payload?.context === "string" ? payload.context.slice(0, 2_000) : "";
  const audience = typeof payload?.audience === "string" ? payload.audience.slice(0, 500) : "";
  const output = typeof payload?.output === "string" ? payload.output.slice(0, 1_000) : "";

  try {
    const result = generateAiPrompt({ framework, tone, length, task, goal, context, audience, output });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Prompt generation failed." },
      { status: 400 },
    );
  }
}
