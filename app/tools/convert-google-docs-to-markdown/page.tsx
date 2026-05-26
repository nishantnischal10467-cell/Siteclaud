import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { GoogleDocsMarkdownConverter } from "@/components/tool/google-docs-markdown-converter";

export const metadata: Metadata = {
  title: "Convert Google Docs to Markdown",
  description: "Enter a public Google Docs URL and convert it into clean Markdown for AI systems, documentation, and content workflows.",
};

export default function ConvertGoogleDocsToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <GoogleDocsMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
