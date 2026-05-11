import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { convertDocxToMarkdown } from "@/lib/docx-converter";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-docx:${ip}`, 8, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a DOCX file to convert." }, { status: 400 });
  }

  if (file.type !== DOCX_MIME && !file.name.toLowerCase().endsWith(".docx")) {
    return NextResponse.json({ error: "Only DOCX files are supported." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "DOCX must be 15MB or smaller." }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await convertDocxToMarkdown(buffer, file.name);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: `docx://${result.fileName}`,
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
      { error: error instanceof Error ? error.message : "DOCX conversion failed." },
      { status: 500 },
    );
  }
}
