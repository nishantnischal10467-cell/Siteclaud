import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { convertWebpageToMarkdown } from "@/lib/converter";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";

const schema = z.object({
  url: z.string().url(),
  aiCleanup: z.boolean().optional(),
  beautify: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert:${ip}`, 8, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Please provide a valid webpage URL." }, { status: 400 });
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
      { error: error instanceof Error ? error.message : "Conversion failed." },
      { status: 500 },
    );
  }
}
