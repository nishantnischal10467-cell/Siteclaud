import { NextRequest, NextResponse } from "next/server";
import { generateChatbotNames, type ChatbotIndustry, type ChatbotNameTone } from "@/lib/ai-chatbot-name-generator";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TONES: ChatbotNameTone[] = ["approachable", "authoritative", "casual", "enthusiastic", "excited", "formal", "friendly", "funny", "informal", "innovative", "inspirational", "neutral", "optimistic", "persuasive", "pessimistic", "professional", "thoughtful"];
const INDUSTRIES: ChatbotIndustry[] = ["agriculture", "automotive", "construction", "crypto", "customer-support", "cybersecurity", "dating", "e-commerce", "education", "energy", "entertainment", "environmental", "fashion", "finance", "food-and-beverage", "gaming", "government", "healthcare", "hospitality", "insurance", "legal", "manufacturing", "marketing", "media", "non-profit", "pharmaceuticals", "real-estate", "software", "sports", "telecommunications", "transportation", "travel", "web3"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`ai-chatbot-name-generator:${ip}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const keywords = typeof payload?.keywords === "string" ? payload.keywords.slice(0, 500) : "";
  const description = typeof payload?.description === "string" ? payload.description.slice(0, 2_000) : "";
  const tone = TONES.includes(payload?.tone) ? payload.tone as ChatbotNameTone : "professional";
  const industry = INDUSTRIES.includes(payload?.industry) ? payload.industry as ChatbotIndustry : "customer-support";
  const prefix = typeof payload?.prefix === "string" ? payload.prefix.slice(0, 24) : "";
  const suffix = typeof payload?.suffix === "string" ? payload.suffix.slice(0, 24) : "";

  try {
    const result = generateChatbotNames({ keywords, description, tone, industry, prefix, suffix });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chatbot name generation failed." },
      { status: 400 },
    );
  }
}
