import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { PasteMarkdownConverter } from "@/components/tool/paste-markdown-converter";

export const metadata: Metadata = {
  title: "Convert Paste to Markdown",
  description: "Paste text, rich content, code, or table data and convert it into clean Markdown instantly.",
};

export default function ConvertPasteToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PasteMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
