import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { NotionMarkdownConverter } from "@/components/tool/notion-markdown-converter";

export const metadata: Metadata = {
  title: "Convert Notion to Markdown",
  description: "Enter a public Notion page URL and convert it into clean Markdown for AI systems, documentation, and content workflows.",
};

export default function ConvertNotionToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <NotionMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
