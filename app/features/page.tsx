import { Bot, Code2, Mail, ShieldCheck, Workflow, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";

const features: Array<[string, string, LucideIcon]> = [
  ["Rendered crawling", "Puppeteer powered extraction for dynamic pages.", Bot],
  ["Clean Markdown", "Turndown and Readability preserve useful structure.", Code2],
  ["API keys", "Generate keys and track usage from the dashboard.", ShieldCheck],
  ["Saved history", "Every conversion can be audited, copied, and reused.", Workflow],
  ["Email summaries", "Send conversion briefs into team workflows.", Mail],
  ["AI cleanup", "Normalize noisy content for prompts and retrieval.", Zap],
];

export default function FeaturesPage() {
  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight">Everything needed to turn websites into AI-grade context</h1>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map(([title, body, Icon]) => (
              <Card key={title} className="rounded-2xl">
                <CardHeader><Icon className="text-blue-600" /><CardTitle>{title}</CardTitle><CardDescription>{body}</CardDescription></CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
