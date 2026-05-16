import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { convertHtmlToMarkdown } from "@/lib/html-converter";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-html:${ip}`, 12, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let html = "";
  let fileName: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    const pastedHtml = formData.get("html");

    if (file instanceof File && file.size > 0) {
      if (!file.name.toLowerCase().endsWith(".html") && !file.name.toLowerCase().endsWith(".htm")) {
        return NextResponse.json({ error: "Only .html and .htm files are supported." }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "HTML file must be 2MB or smaller." }, { status: 413 });
      }

      fileName = file.name;
      html = await file.text();
    } else if (typeof pastedHtml === "string") {
      html = pastedHtml;
    }
  } else {
    const payload = await request.json().catch(() => null);
    html = typeof payload?.html === "string" ? payload.html : "";
    fileName = typeof payload?.fileName === "string" ? payload.fileName : null;
  }

  if (!html.trim()) {
    return NextResponse.json({ error: "Provide HTML content or upload an HTML file." }, { status: 400 });
  }

  if (Buffer.byteLength(html, "utf8") > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "HTML content must be 2MB or smaller." }, { status: 413 });
  }

  try {
    const result = convertHtmlToMarkdown(html, fileName);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: `html://${result.fileName ?? "pasted-html"}`,
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
      { error: error instanceof Error ? error.message : "HTML conversion failed." },
      { status: 500 },
    );
  }
}
