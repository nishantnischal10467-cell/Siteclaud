import pdfParse from "pdf-parse/lib/pdf-parse.js";

export type PdfConversionResult = {
  fileName: string;
  title: string;
  markdown: string;
  pageCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

function titleFromFileName(fileName: string) {
  return fileName.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim() || "PDF document";
}

function textToMarkdown(text: string, fileName: string) {
  const title = titleFromFileName(fileName);
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n/g, " ").replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);

  return [`# ${title}`, ...paragraphs].join("\n\n");
}

export async function convertPdfToMarkdown(buffer: Buffer, fileName: string): Promise<PdfConversionResult> {
  const parsed = await pdfParse(buffer);
  const markdown = textToMarkdown(parsed.text, fileName);
  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;
  const title = parsed.info?.Title?.trim() || titleFromFileName(fileName);

  return {
    fileName,
    title,
    markdown,
    pageCount: parsed.numpages,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    fileSize: buffer.byteLength,
  };
}
