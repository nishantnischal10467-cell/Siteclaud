import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiEmailResponseGenerator } from "@/components/tool/ai-email-response-generator";

export const metadata: Metadata = {
  title: "AI Email Response Generator",
  description: "Create professional, personalized email replies from received emails, goals, language, and tone.",
};

export default function AiEmailResponseGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiEmailResponseGenerator />
        </div>
      </section>
    </PageShell>
  );
}
