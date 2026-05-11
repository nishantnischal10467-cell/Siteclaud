export type ConversionResponse = {
  url: string;
  title: string;
  description: string;
  favicon: string | null;
  markdown: string;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

export type PdfConversionResponse = {
  fileName: string;
  title: string;
  markdown: string;
  pageCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

export type DocxConversionResponse = {
  fileName: string;
  title: string;
  markdown: string;
  messageCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};
