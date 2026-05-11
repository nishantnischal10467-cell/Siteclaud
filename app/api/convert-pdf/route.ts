import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { convertPdfToMarkdown } from "@/lib/pdf-converter";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-pdf:${ip}`, 6, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a PDF file to convert." }, { status: 400 });
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "PDF must be 15MB or smaller." }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await convertPdfToMarkdown(buffer, file.name);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: `pdf://${result.fileName}`,
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
      { error: error instanceof Error ? error.message : "PDF conversion failed." },
      { status: 500 },
    );
  }
}
