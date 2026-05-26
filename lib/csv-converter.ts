export type CsvConversionResult = {
  fileName: string | null;
  title: string;
  markdown: string;
  rowCount: number;
  columnCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

function titleFromFileName(fileName?: string | null) {
  return fileName?.replace(/\.csv$/i, "").replace(/[-_]+/g, " ").trim() || "CSV table";
}

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  rows.push(row);

  return rows.filter((items) => items.some((item) => item.length > 0));
}

function escapeMarkdownTableCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>").trim() || " ";
}

function normalizeRows(rows: string[][]) {
  const columnCount = Math.max(...rows.map((row) => row.length), 1);
  return rows.map((row) => Array.from({ length: columnCount }, (_, index) => row[index] ?? ""));
}

export function convertCsvToMarkdown(csv: string, fileName?: string | null): CsvConversionResult {
  const rows = normalizeRows(parseCsv(csv));

  if (rows.length === 0) {
    throw new Error("CSV content is empty.");
  }

  const [header, ...bodyRows] = rows;
  const safeHeader = header.map((cell, index) => escapeMarkdownTableCell(cell || `Column ${index + 1}`));
  const separator = safeHeader.map(() => "---");
  const safeBody = bodyRows.map((row) => row.map(escapeMarkdownTableCell));
  const tableRows = [safeHeader, separator, ...safeBody].map((row) => `| ${row.join(" | ")} |`);
  const markdown = tableRows.join("\n");
  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    fileName: fileName ?? null,
    title: titleFromFileName(fileName),
    markdown,
    rowCount: rows.length,
    columnCount: safeHeader.length,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    fileSize: Buffer.byteLength(csv, "utf8"),
  };
}
