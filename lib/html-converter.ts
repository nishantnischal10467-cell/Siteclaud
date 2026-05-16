import * as cheerio from "cheerio";
import TurndownService from "turndown";

export type HtmlConversionResult = {
  fileName: string | null;
  title: string;
  markdown: string;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

function titleFromFileName(fileName?: string | null) {
  return fileName?.replace(/\.html?$/i, "").replace(/[-_]+/g, " ").trim() || "HTML document";
}

export function convertHtmlToMarkdown(html: string, fileName?: string | null): HtmlConversionResult {
  const $ = cheerio.load(html);
  $("script, style, noscript, iframe, canvas").remove();
  $('[class*="cookie"], [id*="cookie"], [class*="ads"], [id*="ads"], [class*="modal"], [role="dialog"]').remove();

  const title = $("title").first().text().trim() || $("h1").first().text().trim() || titleFromFileName(fileName);
  const bodyHtml = $("body").length ? $("body").html() || "" : $.html();

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  turndown.keep(["table", "thead", "tbody", "tr", "th", "td"]);

  const markdown = turndown
    .turndown(bodyHtml)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    fileName: fileName ?? null,
    title,
    markdown,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    fileSize: Buffer.byteLength(html, "utf8"),
  };
}
