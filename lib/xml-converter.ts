import * as cheerio from "cheerio";

export type XmlConversionResult = {
  fileName: string | null;
  title: string;
  markdown: string;
  nodeCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

type XmlNode = {
  tagName?: string;
  attribs?: Record<string, string>;
  children?: XmlNode[];
  type?: string;
  data?: string;
};

function titleFromFileName(fileName?: string | null) {
  return fileName?.replace(/\.xml$/i, "").replace(/[-_]+/g, " ").trim() || "XML document";
}

function countElements($: cheerio.CheerioAPI) {
  return $("*").length;
}

function nodeToMarkdown(node: XmlNode, depth = 2): string {
  if (node.type === "text") {
    return node.data?.trim() ?? "";
  }

  if (!node.tagName) {
    return (node.children ?? []).map((child) => nodeToMarkdown(child, depth)).filter(Boolean).join("\n\n");
  }

  const heading = `${"#".repeat(Math.min(depth, 6))} ${node.tagName}`;
  const attributes = Object.entries(node.attribs ?? {});
  const attributeLines = attributes.map(([key, value]) => `- **${key}:** ${value}`);
  const childContent = (node.children ?? [])
    .map((child) => nodeToMarkdown(child, depth + 1))
    .filter(Boolean)
    .join("\n\n");

  return [heading, attributeLines.length ? attributeLines.join("\n") : "", childContent].filter(Boolean).join("\n\n");
}

export function convertXmlToMarkdown(xml: string, fileName?: string | null): XmlConversionResult {
  const $ = cheerio.load(xml, { xmlMode: true });
  const root = $.root().children().first();
  const title = root.length ? root.prop("tagName") ?? titleFromFileName(fileName) : titleFromFileName(fileName);
  const rootNode = root.get(0) as unknown as XmlNode | undefined;
  const body = rootNode ? nodeToMarkdown(rootNode, 1) : "";
  const markdown = [`# ${titleFromFileName(fileName)}`, body].filter(Boolean).join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    fileName: fileName ?? null,
    title: String(title),
    markdown,
    nodeCount: countElements($),
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    fileSize: Buffer.byteLength(xml, "utf8"),
  };
}
