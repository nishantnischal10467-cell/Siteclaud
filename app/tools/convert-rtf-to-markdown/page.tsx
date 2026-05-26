import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { RtfMarkdownConverter } from "@/components/tool/rtf-markdown-converter";

export const metadata: Metadata = {
  title: "Convert RTF to Markdown",
  description: "Upload an RTF file and convert it into clean Markdown for documentation, note-taking, content migration, and AI workflows.",
};

export default function ConvertRtfToMarkdownPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <RtfMarkdownConverter />
        </div>
      </section>
    </PageShell>
  );
}
