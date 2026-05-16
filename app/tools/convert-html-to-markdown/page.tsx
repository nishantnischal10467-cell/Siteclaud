import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { HtmlMarkdownConverter } from "@/components/tool/html-markdown-converter";

export const metadata: Metadata = {
  title: "Convert HTML to Markdown",
  description: "Upload an HTML file or paste markup and convert it into clean Markdown for AI systems, documentation, and content workflows.",
};

export default function ConvertHtmlToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HtmlMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
