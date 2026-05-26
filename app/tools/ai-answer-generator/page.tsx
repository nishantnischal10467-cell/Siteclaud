import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiAnswerGenerator } from "@/components/tool/ai-answer-generator";

export const metadata: Metadata = {
  title: "AI Answer Generator",
  description: "Generate instant, structured answers to questions in your selected language and tone.",
};

export default function AiAnswerGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiAnswerGenerator />
        </div>
      </section>
    </PageShell>
  );
}
