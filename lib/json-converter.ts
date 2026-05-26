export type JsonConversionResult = {
  fileName: string | null;
  title: string;
  markdown: string;
  nodeCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function titleFromFileName(fileName?: string | null) {
  return fileName?.replace(/\.json$/i, "").replace(/[-_]+/g, " ").trim() || "JSON document";
}

function isRecord(value: JsonValue): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isScalar(value: JsonValue) {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

function scalarToString(value: JsonValue) {
  if (value === null) return "null";
  if (typeof value === "string") return value;
  return String(value);
}

function countNodes(value: JsonValue): number {
  if (Array.isArray(value)) return 1 + value.reduce<number>((total, item) => total + countNodes(item), 0);
  if (isRecord(value)) return 1 + Object.values(value).reduce<number>((total, item) => total + countNodes(item), 0);
  return 1;
}

function escapeCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>").trim() || " ";
}

function arrayToTable(items: JsonValue[]) {
  if (!items.length || !items.every(isRecord)) return null;
  const keys = Array.from(new Set(items.flatMap((item) => Object.keys(item))));
  if (!keys.length) return null;
  const simpleRows = items as Array<Record<string, JsonValue>>;
  if (!simpleRows.every((row) => keys.every((key) => isScalar(row[key] ?? null)))) return null;
  const header = `| ${keys.map(escapeCell).join(" | ")} |`;
  const separator = `| ${keys.map(() => "---").join(" | ")} |`;
  const rows = simpleRows.map((row) => `| ${keys.map((key) => escapeCell(scalarToString(row[key] ?? null))).join(" | ")} |`);
  return [header, separator, ...rows].join("\n");
}

function jsonToMarkdown(value: JsonValue, label = "root", depth = 1): string {
  const heading = `${"#".repeat(Math.min(depth, 6))} ${label}`;

  if (isScalar(value)) {
    return `${heading}\n\n${scalarToString(value)}`;
  }

  if (Array.isArray(value)) {
    const table = arrayToTable(value);
    if (table) return `${heading}\n\n${table}`;

    const list = value
      .map((item, index) => {
        if (isScalar(item)) return `- ${scalarToString(item)}`;
        return jsonToMarkdown(item, `Item ${index + 1}`, depth + 1);
      })
      .join("\n\n");
    return `${heading}\n\n${list}`;
  }

  const record = value as Record<string, JsonValue>;
  const scalarEntries = Object.entries(record).filter(([, item]) => isScalar(item));
  const nestedEntries = Object.entries(record).filter(([, item]) => !isScalar(item));
  const scalarMarkdown = scalarEntries.map(([key, item]) => `- **${key}:** ${scalarToString(item)}`).join("\n");
  const nestedMarkdown = nestedEntries.map(([key, item]) => jsonToMarkdown(item, key, depth + 1)).join("\n\n");

  return [heading, scalarMarkdown, nestedMarkdown].filter(Boolean).join("\n\n");
}

export function convertJsonToMarkdown(json: string, fileName?: string | null): JsonConversionResult {
  const parsed = JSON.parse(json) as JsonValue;
  const title = titleFromFileName(fileName);
  const markdown = jsonToMarkdown(parsed, title).replace(/\n{3,}/g, "\n\n").trim();
  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    fileName: fileName ?? null,
    title,
    markdown,
    nodeCount: countNodes(parsed),
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    fileSize: Buffer.byteLength(json, "utf8"),
  };
}
