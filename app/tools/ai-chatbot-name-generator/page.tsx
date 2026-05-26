import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiChatbotNameGenerator } from "@/components/tool/ai-chatbot-name-generator";

export const metadata: Metadata = {
  title: "AI Chatbot Name Generator",
  description: "Generate unique and memorable chatbot names from keywords, descriptions, tone, industry, prefix, and suffix.",
};

export default function AiChatbotNameGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiChatbotNameGenerator />
        </div>
      </section>
    </PageShell>
  );
}
