import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { DocxMarkdownConverter } from "@/components/tool/docx-markdown-converter";

export const metadata: Metadata = {
  title: "Convert DOCX to Markdown",
  description: "Upload a DOCX file and convert it into clean Markdown for AI systems, documentation, and content workflows.",
};

export default function ConvertDocxToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <DocxMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
