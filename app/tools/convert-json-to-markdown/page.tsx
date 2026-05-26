import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { JsonMarkdownConverter } from "@/components/tool/json-markdown-converter";

export const metadata: Metadata = {
  title: "Convert JSON to Markdown",
  description: "Upload any JSON file or paste JSON data and convert it into well-formatted Markdown.",
};

export default function ConvertJsonToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <JsonMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
