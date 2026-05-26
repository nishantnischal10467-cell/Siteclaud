import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiPromptGenerator } from "@/components/tool/ai-prompt-generator";

export const metadata: Metadata = {
  title: "AI Prompt Generator",
  description: "Create high-quality AI prompts with proven frameworks like APE, RACE, CREATE, TRACE, ROSES, and SPARK.",
};

export default function AiPromptGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiPromptGenerator />
        </div>
      </section>
    </PageShell>
  );
}
