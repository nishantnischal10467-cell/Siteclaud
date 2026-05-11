import Link from "next/link";
import { ArrowRight, Braces, FileText, FileUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";

const tools = [
  { title: "Convert Webpage to Markdown", body: "Extract readable content from dynamic webpages and export clean Markdown.", icon: FileText, href: "/tools/convert-webpage-to-markdown" },
  { title: "Convert PDF to Markdown", body: "Upload text-based PDFs and transform them into Markdown for AI workflows.", icon: FileUp, href: "/tools/convert-pdf-to-markdown" },
  { title: "AI Cleanup Mode", body: "Remove boilerplate and normalize documents for LLM ingestion.", icon: Sparkles, href: "/tools/convert-webpage-to-markdown" },
  { title: "Structured API Extractor", body: "Turn pages into source-aware JSON and Markdown payloads.", icon: Braces, href: "/dashboard/api" },
];

export default function ToolsPage() {
  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge variant="secondary">Siteclaud tools</Badge>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight">Practical AI utilities for cleaner knowledge workflows</h1>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool) => (
              <Card key={tool.title} className="rounded-2xl">
                <CardHeader><tool.icon className="text-blue-600" /><CardTitle>{tool.title}</CardTitle><CardDescription>{tool.body}</CardDescription></CardHeader>
                <CardContent><Button asChild><Link href={tool.href}>Open tool <ArrowRight data-icon="inline-end" /></Link></Button></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
