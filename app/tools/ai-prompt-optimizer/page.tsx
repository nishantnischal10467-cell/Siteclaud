import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiPromptOptimizer } from "@/components/tool/ai-prompt-optimizer";

export const metadata: Metadata = {
  title: "AI Prompt Optimizer",
  description: "Transform rough prompts into structured, framework-based instructions for stronger AI outputs.",
};

export default function AiPromptOptimizerPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiPromptOptimizer />
        </div>
      </section>
    </PageShell>
  );
}
