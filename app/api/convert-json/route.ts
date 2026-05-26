import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { convertJsonToMarkdown } from "@/lib/json-converter";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-json:${ip}`, 12, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let json = "";
  let fileName: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    const pastedJson = formData.get("json");

    if (file instanceof File && file.size > 0) {
      if (!file.name.toLowerCase().endsWith(".json")) {
        return NextResponse.json({ error: "Only .json files are supported." }, { status: 400 });
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "JSON file must be 2MB or smaller." }, { status: 413 });
      }

      fileName = file.name;
      json = await file.text();
    } else if (typeof pastedJson === "string") {
      json = pastedJson;
    }
  } else {
    const payload = await request.json().catch(() => null);
    json = typeof payload?.json === "string" ? payload.json : "";
    fileName = typeof payload?.fileName === "string" ? payload.fileName : null;
  }

  if (!json.trim()) {
    return NextResponse.json({ error: "Provide JSON content or upload a JSON file." }, { status: 400 });
  }

  if (Buffer.byteLength(json, "utf8") > MAX_SIZE) {
    return NextResponse.json({ error: "JSON content must be 2MB or smaller." }, { status: 413 });
  }

  try {
    const result = convertJsonToMarkdown(json, fileName);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: `json://${result.fileName ?? "pasted-json"}`,
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
      { error: error instanceof Error ? error.message : "JSON conversion failed. Make sure the JSON is valid." },
      { status: 500 },
    );
  }
}
