import { convertHtmlToMarkdown } from "@/lib/html-converter";
import type { ConversionResponse } from "@/types/conversion";

function getGoogleDocsExportUrl(input: string) {
  const url = new URL(input);
  const hostname = url.hostname.toLowerCase();

  if (hostname !== "docs.google.com") {
    throw new Error("Enter a public Google Docs URL from docs.google.com.");
  }

  const documentMatch = url.pathname.match(/^\/document\/(?:u\/\d+\/)?d\/([^/]+)/);
  if (documentMatch?.[1]) {
    return `https://docs.google.com/document/d/${documentMatch[1]}/export?format=html`;
  }

  const publishedMatch = url.pathname.match(/^\/document\/d\/e\/([^/]+)\/pub/);
  if (publishedMatch?.[1]) {
    url.searchParams.set("output", "1");
    return url.toString();
  }

  throw new Error("Enter a valid Google Docs document URL.");
}

export async function convertGoogleDocsToMarkdown(inputUrl: string): Promise<ConversionResponse> {
  const exportUrl = getGoogleDocsExportUrl(inputUrl);
  const response = await fetch(exportUrl, {
    headers: {
      "user-agent": "SiteclaudBot/1.0 (+https://siteclaud.com)",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error("Unable to export this Google Doc. Make sure it is publicly accessible.");
  }

  const html = await response.text();
  if (/sign in|request access|you need access/i.test(html)) {
    throw new Error("This Google Doc does not appear to be public.");
  }

  const converted = convertHtmlToMarkdown(html, "google-doc.html");

  return {
    url: inputUrl,
    title: converted.title,
    description: "Converted from a public Google Docs document.",
    favicon: "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png",
    markdown: converted.markdown,
    wordCount: converted.wordCount,
    characterCount: converted.characterCount,
    tokenEstimate: converted.tokenEstimate,
  };
}
