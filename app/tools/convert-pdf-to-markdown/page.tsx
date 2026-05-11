import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { PdfMarkdownConverter } from "@/components/tool/pdf-markdown-converter";

export const metadata: Metadata = {
  title: "Convert PDF to Markdown",
  description: "Upload a PDF and convert it into clean Markdown for AI systems, documentation, and content workflows.",
};

export default function ConvertPdfToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PdfMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
