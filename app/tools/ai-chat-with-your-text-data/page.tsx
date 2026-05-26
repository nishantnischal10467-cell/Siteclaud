import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiChatTextData } from "@/components/tool/ai-chat-text-data";

export const metadata: Metadata = {
  title: "AI Chat with Your Text Data",
  description: "Paste plain text and ask questions with source-backed AI answers, evidence snippets, and exportable chat transcripts.",
};

export default function AiChatWithYourTextDataPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiChatTextData />
        </div>
      </section>
    </PageShell>
  );
}
