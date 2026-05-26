import { NextRequest, NextResponse } from "next/server";
import { chatWithWebsiteData } from "@/lib/ai-chat-website-data";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-chat-website-data:${ip}`, 12, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const url = typeof payload?.url === "string" ? payload.url.slice(0, 2_000) : "";
  const question = typeof payload?.question === "string" ? payload.question.slice(0, 1_000) : "";

  if (!url.trim()) {
    return NextResponse.json({ error: "Enter a webpage URL before chatting." }, { status: 400 });
  }

  if (!question.trim()) {
    return NextResponse.json({ error: "Ask a question about the webpage." }, { status: 400 });
  }

  try {
    const result = await chatWithWebsiteData({ url, question });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Website chat failed." },
      { status: 400 },
    );
  }
}
