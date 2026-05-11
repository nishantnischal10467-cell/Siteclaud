declare module "pdf-parse" {
  type PdfParseResult = {
    numpages: number;
    text: string;
    info?: {
      Title?: string;
      [key: string]: unknown;
    };
  };

  function pdfParse(buffer: Buffer): Promise<PdfParseResult>;

  export default pdfParse;
}

declare module "pdf-parse/lib/pdf-parse.js" {
  type PdfParseResult = {
    numpages: number;
    text: string;
    info?: {
      Title?: string;
      [key: string]: unknown;
    };
  };

  function pdfParse(buffer: Buffer): Promise<PdfParseResult>;

  export default pdfParse;
}
