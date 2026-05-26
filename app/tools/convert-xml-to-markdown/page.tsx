import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { XmlMarkdownConverter } from "@/components/tool/xml-markdown-converter";

export const metadata: Metadata = {
  title: "Convert XML to Markdown",
  description: "Paste XML content or upload an XML file and convert it into clean Markdown for documentation and content workflows.",
};

export default function ConvertXmlToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <XmlMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
