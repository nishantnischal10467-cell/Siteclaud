import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiReplyGenerator } from "@/components/tool/ai-reply-generator";

export const metadata: Metadata = {
  title: "AI Reply Generator",
  description: "Generate thoughtful, context-aware replies for email, social media, comments, DMs, and professional communication.",
};

export default function AiReplyGeneratorPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiReplyGenerator />
        </div>
      </section>
    </PageShell>
  );
}
