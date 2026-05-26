import { convertHtmlToMarkdown } from "@/lib/html-converter";

export type PasteFormat = "auto" | "plain" | "rich" | "code" | "table";

export type PasteConversionResult = {
  title: string;
  markdown: string;
  detectedFormat: Exclude<PasteFormat, "auto">;
  lineCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

function detectFormat(content: string): Exclude<PasteFormat, "auto"> {
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/).filter(Boolean);

  if (HTML_TAG_PATTERN.test(trimmed)) return "rich";
  if (lines.length >= 2 && lines.every((line) => line.includes("\t") || line.includes(","))) return "table";
  if (/^(```|~~~)/.test(trimmed) || lines.some((line) => /^\s{2,}(const|let|var|function|class|import|export|def|SELECT|<)/.test(line))) return "code";
  return "plain";
}

function normalizeWhitespace(content: string) {
  return content.replace(/\r\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim();
}

function convertPlainText(content: string) {
  return normalizeWhitespace(content)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^[-*]\s+/m.test(block) || /^\d+[.)]\s+/m.test(block)) return block;
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.length === 1 && lines[0].length <= 72 && !/[.!?]$/.test(lines[0])) return `## ${lines[0]}`;
      return lines.join("\n");
    })
    .join("\n\n");
}

function fenceCode(content: string) {
  const trimmed = normalizeWhitespace(content).replace(/^```[^\n]*\n?/, "").replace(/\n?```$/, "");
  return `\`\`\`\n${trimmed}\n\`\`\``;
}

function parseDelimitedRows(content: string) {
  const lines = normalizeWhitespace(content).split("\n").filter((line) => line.trim());
  const delimiter = lines.some((line) => line.includes("\t")) ? "\t" : ",";
  return lines.map((line) => line.split(delimiter).map((cell) => cell.trim()));
}

function escapeCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>").trim() || " ";
}

function convertTableData(content: string) {
  const rows = parseDelimitedRows(content);
  if (!rows.length) throw new Error("Table content is empty.");

  const columnCount = Math.max(...rows.map((row) => row.length), 1);
  const normalized = rows.map((row) => Array.from({ length: columnCount }, (_, index) => row[index] ?? ""));
  const [header, ...bodyRows] = normalized;
  const safeHeader = header.map((cell, index) => escapeCell(cell || `Column ${index + 1}`));
  const separator = safeHeader.map(() => "---");
  const safeBody = bodyRows.map((row) => row.map(escapeCell));

  return [safeHeader, separator, ...safeBody].map((row) => `| ${row.join(" | ")} |`).join("\n");
}

export function convertPasteToMarkdown(content: string, format: PasteFormat = "auto"): PasteConversionResult {
  if (!content.trim()) {
    throw new Error("Paste content is empty.");
  }

  const detectedFormat = format === "auto" ? detectFormat(content) : format;
  const markdown = (() => {
    if (detectedFormat === "rich") return convertHtmlToMarkdown(content, "pasted-content.html").markdown;
    if (detectedFormat === "code") return fenceCode(content);
    if (detectedFormat === "table") return convertTableData(content);
    return convertPlainText(content);
  })().replace(/\n{3,}/g, "\n\n").trim();

  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    title: "Pasted content",
    markdown,
    detectedFormat,
    lineCount: content.trim().split(/\r?\n/).length,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    fileSize: Buffer.byteLength(content, "utf8"),
  };
}
