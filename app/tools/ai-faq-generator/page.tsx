import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiFaqGenerator } from "@/components/tool/ai-faq-generator";

export const metadata: Metadata = {
  title: "AI FAQ Generator",
  description: "Generate custom questions and answers from any topic, product description, help article, or website content.",
};

export default function AiFaqGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiFaqGenerator />
        </div>
      </section>
    </PageShell>
  );
}
