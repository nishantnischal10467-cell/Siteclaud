import type { Metadata } from "next";
import { MarkdownConverter } from "@/components/tool/markdown-converter";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Convert Webpage to Markdown",
  description: "Convert any webpage URL into clean Markdown for AI systems, documentation, and content workflows.",
};

export default function ConvertWebpageToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <MarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
