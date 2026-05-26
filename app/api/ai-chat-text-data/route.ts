import { NextRequest, NextResponse } from "next/server";
import { chatWithTextData } from "@/lib/ai-chat-text-data";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-chat-text-data:${ip}`, 30, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const text = typeof payload?.text === "string" ? payload.text.slice(0, 25_000) : "";
  const question = typeof payload?.question === "string" ? payload.question.slice(0, 1_000) : "";

  try {
    const result = chatWithTextData({ text, question });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Text chat failed." },
      { status: 400 },
    );
  }
}
