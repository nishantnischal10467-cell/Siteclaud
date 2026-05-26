import { NextRequest, NextResponse } from "next/server";
import { generateAiReply, type ReplyLength, type ReplySource, type ReplyStyle } from "@/lib/ai-reply-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const SOURCES: ReplySource[] = [
  "email",
  "linkedin-comment",
  "linkedin-message",
  "x-tweet",
  "x-reply",
  "facebook-post",
  "facebook-comment",
  "instagram-comment",
  "instagram-dm",
  "youtube-comment",
  "reddit-comment",
  "discord-message",
  "slack-message",
  "whatsapp-message",
  "text-message",
  "other",
];
const STYLES: ReplyStyle[] = ["professional", "casual", "friendly", "enthusiastic", "formal", "informal", "witty", "empathetic", "confident", "diplomatic"];
const LENGTHS: ReplyLength[] = ["shorter", "longer"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-reply-generator:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const message = typeof payload?.message === "string" ? payload.message.slice(0, 4_000) : "";
  const instructions = typeof payload?.instructions === "string" ? payload.instructions.slice(0, 1_500) : "";
  const context = typeof payload?.context === "string" ? payload.context.slice(0, 1_500) : "";
  const source = SOURCES.includes(payload?.source) ? payload.source as ReplySource : "email";
  const style = STYLES.includes(payload?.style) ? payload.style as ReplyStyle : "professional";
  const length = LENGTHS.includes(payload?.length) ? payload.length as ReplyLength : "shorter";
  const language = typeof payload?.language === "string" && payload.language.trim() ? payload.language.slice(0, 80) : "English";

  if (!message.trim()) {
    return NextResponse.json({ error: "Add the message you want to reply to." }, { status: 400 });
  }

  const result = generateAiReply({ message, instructions, context, source, style, length, language });
  return NextResponse.json(result);
}
