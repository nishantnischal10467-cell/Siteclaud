import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { convertRtfToMarkdown } from "@/lib/rtf-converter";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-rtf:${ip}`, 10, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload an RTF file to convert." }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".rtf")) {
    return NextResponse.json({ error: "Only RTF files are supported." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "RTF must be 2MB or smaller." }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await convertRtfToMarkdown(buffer, file.name);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: `rtf://${result.fileName}`,
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
      { error: error instanceof Error ? error.message : "RTF conversion failed." },
      { status: 500 },
    );
  }
}
