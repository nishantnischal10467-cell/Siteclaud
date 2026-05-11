import * as cheerio from "cheerio";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";
import puppeteer from "puppeteer";

export type ConversionResult = {
  url: string;
  title: string;
  description: string;
  favicon: string | null;
  markdown: string;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

function normalizeUrl(value: string) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }
  return url.toString();
}

function cleanHtml(html: string, url: string) {
  const $ = cheerio.load(html);
  $("script, style, noscript, iframe, svg, canvas, form, nav, footer, header, aside").remove();
  $('[class*="cookie"], [id*="cookie"], [class*="modal"], [class*="ads"], [id*="ads"], [aria-label*="cookie"]').remove();

  const title = $("title").first().text().trim() || $("h1").first().text().trim() || new URL(url).hostname;
  const description = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const faviconHref = $('link[rel="icon"], link[rel="shortcut icon"]').first().attr("href");
  const favicon = faviconHref ? new URL(faviconHref, url).toString() : null;

  $("a[href]").each((_, node) => {
    const href = $(node).attr("href");
    if (href) $(node).attr("href", new URL(href, url).toString());
  });

  $("img[src]").each((_, node) => {
    const src = $(node).attr("src");
    if (src) $(node).attr("src", new URL(src, url).toString());
  });

  return { html: $.html(), title, description, favicon };
}

async function fetchRenderedHtml(url: string) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    await page.setUserAgent("SiteclaudBot/1.0 (+https://siteclaud.com)");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
    return await page.content();
  } finally {
    await browser?.close();
  }
}

async function fetchHtml(url: string) {
  try {
    return await fetchRenderedHtml(url);
  } catch {
    const response = await fetch(url, { headers: { "user-agent": "SiteclaudBot/1.0" } });
    if (!response.ok) {
      throw new Error(`Unable to fetch webpage (${response.status}).`);
    }
    return response.text();
  }
}

export async function convertWebpageToMarkdown(inputUrl: string): Promise<ConversionResult> {
  const url = normalizeUrl(inputUrl);
  const rawHtml = await fetchHtml(url);
  const cleaned = cleanHtml(rawHtml, url);
  const dom = new JSDOM(cleaned.html, { url });
  const article = new Readability(dom.window.document).parse();
  const readableHtml = article?.content || cleaned.html;

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  turndown.keep(["table", "thead", "tbody", "tr", "th", "td"]);
  const markdown = turndown.turndown(readableHtml).replace(/\n{3,}/g, "\n\n").trim();
  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    url,
    title: article?.title || cleaned.title,
    description: cleaned.description,
    favicon: cleaned.favicon,
    markdown,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}
