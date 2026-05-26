import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { convertPasteToMarkdown, type PasteFormat } from "@/lib/paste-converter";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_SIZE = 10_000;
const FORMATS: PasteFormat[] = ["auto", "plain", "rich", "code", "table"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-paste:${ip}`, 18, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const content = typeof payload?.content === "string" ? payload.content : "";
  const format = FORMATS.includes(payload?.format) ? payload.format as PasteFormat : "auto";

  if (!content.trim()) {
    return NextResponse.json({ error: "Paste text content before converting." }, { status: 400 });
  }

  if (content.length > MAX_SIZE || Buffer.byteLength(content, "utf8") > MAX_SIZE * 4) {
    return NextResponse.json({ error: "Pasted content must be 10,000 characters or fewer." }, { status: 413 });
  }

  try {
    const result = convertPasteToMarkdown(content, format);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: "paste://pasted-content",
        title: result.title,
        markdown: result.markdown,
        wordCount: result.wordCount,
        characterCount: result.characterCount,
        tokenEstimate: result.tokenEstimate,
      },
    }).catch(() => null);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Paste conversion failed." },
      { status: 500 },
    );
  }
}
