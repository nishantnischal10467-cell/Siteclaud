import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiLetterGenerator } from "@/components/tool/ai-letter-generator";

export const metadata: Metadata = {
  title: "AI Letter Generator",
  description: "Generate polished personal, business, cover, apology, recommendation, and invitation letters.",
};

export default function AiLetterGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiLetterGenerator />
        </div>
      </section>
    </PageShell>
  );
}
