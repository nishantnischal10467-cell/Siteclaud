import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { AiChatWebsiteData } from "@/components/tool/ai-chat-website-data";

export const metadata: Metadata = {
  title: "AI Chat with Your Website Data",
  description: "Enter any webpage URL and chat with source-backed AI answers generated from extracted website content.",
};

export default function AiChatWithYourWebsiteDataPage() {
  return (
    <PageShell>
      <section className="blueprint-grid px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AiChatWebsiteData />
        </div>
      </section>
    </PageShell>
  );
}
