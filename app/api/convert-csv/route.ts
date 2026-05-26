import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { convertCsvToMarkdown } from "@/lib/csv-converter";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-csv:${ip}`, 12, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let csv = "";
  let fileName: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    const pastedCsv = formData.get("csv");

    if (file instanceof File && file.size > 0) {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        return NextResponse.json({ error: "Only .csv files are supported." }, { status: 400 });
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "CSV file must be 2MB or smaller." }, { status: 413 });
      }

      fileName = file.name;
      csv = await file.text();
    } else if (typeof pastedCsv === "string") {
      csv = pastedCsv;
    }
  } else {
    const payload = await request.json().catch(() => null);
    csv = typeof payload?.csv === "string" ? payload.csv : "";
    fileName = typeof payload?.fileName === "string" ? payload.fileName : null;
  }

  if (!csv.trim()) {
    return NextResponse.json({ error: "Provide CSV content or upload a CSV file." }, { status: 400 });
  }

  if (Buffer.byteLength(csv, "utf8") > MAX_SIZE) {
    return NextResponse.json({ error: "CSV content must be 2MB or smaller." }, { status: 413 });
  }

  try {
    const result = convertCsvToMarkdown(csv, fileName);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: `csv://${result.fileName ?? "pasted-csv"}`,
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
      { error: error instanceof Error ? error.message : "CSV conversion failed. Make sure the CSV is valid." },
      { status: 500 },
    );
  }
}
