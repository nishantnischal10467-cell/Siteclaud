import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiSaasBrandNameGenerator } from "@/components/tool/ai-saas-brand-name-generator";

export const metadata: Metadata = {
  title: "AI SaaS Brand Name Generator",
  description: "Generate memorable SaaS product names from keywords, product descriptions, tone, and industry.",
};

export default function AiSaasBrandNameGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiSaasBrandNameGenerator />
        </div>
      </section>
    </PageShell>
  );
}
