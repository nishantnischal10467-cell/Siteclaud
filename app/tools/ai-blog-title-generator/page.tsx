import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiBlogTitleGenerator } from "@/components/tool/ai-blog-title-generator";

export const metadata: Metadata = {
  title: "AI Blog Title Generator",
  description: "Generate catchy, SEO-friendly blog titles from keywords, summaries, audiences, languages, and tones.",
};

export default function AiBlogTitleGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiBlogTitleGenerator />
        </div>
      </section>
    </PageShell>
  );
}
