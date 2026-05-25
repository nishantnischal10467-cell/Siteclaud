import Link from "next/link";
import { ArrowRight, Bot, Braces, Clipboard, Code2, FileCode2, FileQuestion, FileText, FileType2, FileUp, Globe2, HelpCircle, Layers3, Mail, MessageSquareReply, MessageSquareText, Sparkles, Table2, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";

const markdownTools = [
  { title: "Convert Webpage to Markdown", body: "Extract readable content from dynamic webpages and export clean Markdown.", icon: FileText, href: "/tools/convert-webpage-to-markdown" },
  { title: "Convert Notion to Markdown", body: "Convert public Notion pages into Markdown for archiving and AI context.", icon: FileText, href: "/tools/convert-notion-to-markdown" },
  { title: "Convert Google Docs to Markdown", body: "Export public Google Docs to Markdown for documentation and migrations.", icon: FileText, href: "/tools/convert-google-docs-to-markdown" },
  { title: "Convert HTML to Markdown", body: "Upload or paste HTML and produce clean Markdown for migrations and docs.", icon: Code2, href: "/tools/convert-html-to-markdown" },
  { title: "Convert XML to Markdown", body: "Paste XML content and turn nested nodes into readable Markdown.", icon: FileCode2, href: "/tools/convert-xml-to-markdown" },
  { title: "Convert JSON to Markdown", body: "Upload JSON and turn structured data into readable Markdown instantly.", icon: Braces, href: "/tools/convert-json-to-markdown" },
  { title: "Convert CSV to Markdown", body: "Upload CSV data and turn it into clean Markdown tables instantly.", icon: Table2, href: "/tools/convert-csv-to-markdown" },
  { title: "Convert RTF to Markdown", body: "Upload rich text documents and normalize them into clean Markdown.", icon: FileText, href: "/tools/convert-rtf-to-markdown" },
  { title: "Convert Paste to Markdown", body: "Paste text, code, rich content, or table data and format it as Markdown.", icon: Clipboard, href: "/tools/convert-paste-to-markdown" },
  { title: "Convert PDF to Markdown", body: "Upload text-based PDFs and transform them into Markdown for AI workflows.", icon: FileUp, href: "/tools/convert-pdf-to-markdown" },
  { title: "Convert DOCX to Markdown", body: "Turn Word documents into clean Markdown while preserving useful structure.", icon: FileType2, href: "/tools/convert-docx-to-markdown" },
];

const aiTools = [
  { title: "AI Reply Generator", body: "Write thoughtful replies for emails, comments, DMs, and professional messages.", icon: MessageSquareReply, href: "/tools/ai-reply-generator" },
  { title: "AI Prompt Generator", body: "Create framework-based prompts for ChatGPT, Claude, and AI workflows.", icon: WandSparkles, href: "/tools/ai-prompt-generator" },
  { title: "AI Prompt Optimizer", body: "Rewrite rough prompts into structured frameworks with clearer expectations.", icon: Sparkles, href: "/tools/ai-prompt-optimizer" },
  { title: "AI FAQ Generator", body: "Generate publish-ready FAQs and FAQPage schema from any topic or content.", icon: FileQuestion, href: "/tools/ai-faq-generator" },
  { title: "AI Answer Generator", body: "Generate structured answers with key points and follow-up questions.", icon: HelpCircle, href: "/tools/ai-answer-generator" },
  { title: "AI Email Response Generator", body: "Create professional replies from received emails and response goals.", icon: Mail, href: "/tools/ai-email-response-generator" },
  { title: "AI Letter Generator", body: "Draft polished personal and business letters in the right tone.", icon: FileText, href: "/tools/ai-letter-generator" },
  { title: "AI Blog Title Generator", body: "Generate catchy SEO-friendly headlines from keywords and summaries.", icon: FileText, href: "/tools/ai-blog-title-generator" },
  { title: "AI Chatbot Name Generator", body: "Create memorable chatbot names by tone, industry, prefix, and suffix.", icon: Bot, href: "/tools/ai-chatbot-name-generator" },
  { title: "AI SaaS Brand Name Generator", body: "Generate SaaS product names with domain hints and positioning rationale.", icon: Layers3, href: "/tools/ai-saas-brand-name-generator" },
  { title: "AI Cleanup Mode", body: "Remove boilerplate and normalize documents for LLM ingestion.", icon: Sparkles, href: "/tools/convert-webpage-to-markdown" },
  { title: "Structured API Extractor", body: "Turn pages into source-aware JSON and Markdown payloads.", icon: Braces, href: "/dashboard/api" },
];

const aiChatTools = [
  { title: "AI Chat with Your Text Data", body: "Paste text, ask questions, and get source-backed answers with evidence snippets.", icon: MessageSquareText, href: "/tools/ai-chat-with-your-text-data" },
  { title: "AI Chat with Your Website Data", body: "Enter a webpage URL and chat with source-backed answers from extracted page content.", icon: Globe2, href: "/tools/ai-chat-with-your-website-data" },
];

function ToolGrid({ tools }: { tools: typeof markdownTools }) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {tools.map((tool) => (
        <Card key={tool.title} className="rounded-2xl">
          <CardHeader><tool.icon className="text-blue-600" /><CardTitle>{tool.title}</CardTitle><CardDescription>{tool.body}</CardDescription></CardHeader>
          <CardContent><Button asChild><Link href={tool.href}>Open tool <ArrowRight data-icon="inline-end" /></Link></Button></CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge variant="secondary">Siteclaud tools</Badge>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight">Practical AI utilities for cleaner knowledge workflows</h1>
          <div className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge variant="secondary">Convert to Markdown</Badge>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Transform content into clean Markdown</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">Convert webpages, docs, structured files, and pasted content into AI-ready Markdown.</p>
            </div>
            <ToolGrid tools={markdownTools} />
          </div>
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge variant="secondary">AI Generators</Badge>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Generate useful drafts in seconds</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">Practical AI writing tools for support, social, sales, and documentation workflows.</p>
            </div>
            <ToolGrid tools={aiTools} />
          </div>
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge variant="secondary">AI Chat Tools</Badge>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Chat with your own knowledge data</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">Ask grounded questions against text, documents, and support material before turning it into chatbot-ready knowledge.</p>
            </div>
            <ToolGrid tools={aiChatTools} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
