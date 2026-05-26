import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { convertGoogleDocsToMarkdown } from "@/lib/google-docs-converter";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-google-docs:${ip}`, 8, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Please provide a valid public Google Docs URL." }, { status: 400 });
  }

  try {
    const result = await convertGoogleDocsToMarkdown(payload.data.url);
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
      { error: error instanceof Error ? error.message : "Google Docs conversion failed. Make sure the document is public." },
      { status: 500 },
    );
  }
}
