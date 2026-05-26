import rtfToHtml from "@iarna/rtf-to-html";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export type RtfConversionResult = {
  fileName: string;
  title: string;
  markdown: string;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

function titleFromFileName(fileName: string) {
  return fileName.replace(/\.rtf$/i, "").replace(/[-_]+/g, " ").trim() || "RTF document";
}

function rtfBufferToHtml(buffer: Buffer) {
  return new Promise<string>((resolve, reject) => {
    rtfToHtml.fromString(buffer.toString("utf8"), (error, html) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(html);
    });
  });
}

function extractBodyHtml(html: string) {
  const dom = new JSDOM(html);
  return dom.window.document.body.innerHTML;
}

export async function convertRtfToMarkdown(buffer: Buffer, fileName: string): Promise<RtfConversionResult> {
  const html = await rtfBufferToHtml(buffer);
  const bodyHtml = extractBodyHtml(html);
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  turndown.addRule("underline", {
    filter: ["u"],
    replacement: (content) => content,
  });

  const title = titleFromFileName(fileName);
  const body = turndown.turndown(bodyHtml).replace(/\n{3,}/g, "\n\n").trim();
  const markdown = [`# ${title}`, body].filter(Boolean).join("\n\n");
  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    fileName,
    title,
    markdown,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    fileSize: buffer.byteLength,
  };
}
