import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { convertWebpageToMarkdown } from "@/lib/converter";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  url: z.string().url(),
});

function isNotionUrl(value: string) {
  const hostname = new URL(value).hostname.toLowerCase();
  return hostname === "notion.so" || hostname.endsWith(".notion.so") || hostname === "notion.site" || hostname.endsWith(".notion.site");
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-notion:${ip}`, 8, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Please provide a valid public Notion page URL." }, { status: 400 });
  }

  if (!isNotionUrl(payload.data.url)) {
    return NextResponse.json({ error: "Enter a public notion.so or notion.site page URL." }, { status: 400 });
  }

  try {
    const result = await convertWebpageToMarkdown(payload.data.url);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: result.url,
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
      { error: error instanceof Error ? error.message : "Notion conversion failed. Make sure the page is public." },
      { status: 500 },
    );
  }
}
