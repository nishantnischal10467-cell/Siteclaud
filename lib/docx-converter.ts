import mammoth from "mammoth";
import TurndownService from "turndown";

export type DocxConversionResult = {
  fileName: string;
  title: string;
  markdown: string;
  messageCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

function titleFromFileName(fileName: string) {
  return fileName.replace(/\.(docx|doc)$/i, "").replace(/[-_]+/g, " ").trim() || "Word document";
}

export async function convertDocxToMarkdown(buffer: Buffer, fileName: string): Promise<DocxConversionResult> {
  const html = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => p.subtitle:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Quote'] => blockquote:fresh",
      ],
    },
  );

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  turndown.keep(["table", "thead", "tbody", "tr", "th", "td"]);

  const title = titleFromFileName(fileName);
  const body = turndown.turndown(html.value).replace(/\n{3,}/g, "\n\n").trim();
  const markdown = [`# ${title}`, body].filter(Boolean).join("\n\n");
  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    fileName,
    title,
    markdown,
    messageCount: html.messages.length,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    fileSize: buffer.byteLength,
  };
}
