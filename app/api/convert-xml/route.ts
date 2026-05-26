import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { convertXmlToMarkdown } from "@/lib/xml-converter";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`convert-xml:${ip}`, 12, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let xml = "";
  let fileName: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    const pastedXml = formData.get("xml");

    if (file instanceof File && file.size > 0) {
      if (!file.name.toLowerCase().endsWith(".xml")) {
        return NextResponse.json({ error: "Only .xml files are supported." }, { status: 400 });
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "XML file must be 2MB or smaller." }, { status: 413 });
      }

      fileName = file.name;
      xml = await file.text();
    } else if (typeof pastedXml === "string") {
      xml = pastedXml;
    }
  } else {
    const payload = await request.json().catch(() => null);
    xml = typeof payload?.xml === "string" ? payload.xml : "";
    fileName = typeof payload?.fileName === "string" ? payload.fileName : null;
  }

  if (!xml.trim()) {
    return NextResponse.json({ error: "Provide XML content or upload an XML file." }, { status: 400 });
  }

  if (Buffer.byteLength(xml, "utf8") > MAX_SIZE) {
    return NextResponse.json({ error: "XML content must be 2MB or smaller." }, { status: 413 });
  }

  try {
    const result = convertXmlToMarkdown(xml, fileName);
    const user = await getCurrentUser();

    await prisma.conversion.create({
      data: {
        userId: user?.id,
        url: `xml://${result.fileName ?? "pasted-xml"}`,
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
      { error: error instanceof Error ? error.message : "XML conversion failed. Make sure the XML is valid." },
      { status: 500 },
    );
  }
}
