import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { CsvMarkdownConverter } from "@/components/tool/csv-markdown-converter";

export const metadata: Metadata = {
  title: "Convert CSV to Markdown",
  description: "Upload any CSV file or paste CSV data and convert it into a clean Markdown table.",
};

export default function ConvertCsvToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CsvMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
