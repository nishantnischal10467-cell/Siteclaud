"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Download, FileJson, HelpCircle, Loader2, RotateCcw, Sparkles, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AiFaqGeneratorResponse, FaqTone } from "@/types/conversion";

const counts = [1, 4, 7, 10] as const;
const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Hindi", "Arabic", "Chinese (Mandarin)", "Japanese", "Korean", "Dutch", "Swedish", "Tamil", "Telugu", "Urdu", "Vietnamese"];
const tones: Array<{ value: FaqTone; label: string }> = [
  { value: "approachable", label: "Approachable" },
  { value: "authoritative", label: "Authoritative" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "funny", label: "Funny" },
  { value: "neutral", label: "Neutral" },
  { value: "optimistic", label: "Optimistic" },
  { value: "persuasive", label: "Persuasive" },
  { value: "professional", label: "Professional" },
  { value: "thoughtful", label: "Thoughtful" },
];

async function generateFaqs(payload: {
  content: string;
  count: 1 | 4 | 7 | 10;
  language: string;
  tone: FaqTone;
}) {
  const response = await fetch("/api/ai-faq-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "FAQ generation failed.");
  }

  return data as AiFaqGeneratorResponse;
}

export function AiFaqGenerator() {
  const [content, setContent] = useState("Siteclaud converts websites, PDFs, DOCX files, JSON, CSV, XML, and pasted content into clean Markdown for AI systems. Teams use it to prepare chatbot training data, documentation, knowledge bases, and support workflows.");
  const [count, setCount] = useState<1 | 4 | 7 | 10>(4);
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState<FaqTone>("professional");
  const [result, setResult] = useState<AiFaqGeneratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: generateFaqs,
    onSuccess: (data) => {
      setResult(data);
      toast.success("FAQs generated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "FAQ generation failed."),
  });

  const activeOutput = useMemo(
    () => result?.markdown ?? "Generated FAQs will appear here. Add your topic, product notes, help article, or source content to create ready-to-publish questions and answers.",
    [result],
  );

  function copyOutput(value = result?.markdown) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied FAQs to clipboard.");
  }

  function download(name: string, value?: string) {
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setContent("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI generator</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI FAQ Generator</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Generate custom questions and answers from any topic, product description, help article, or website content.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <label className="grid gap-2 text-sm font-medium">
              Content
              <Textarea
                value={content}
                onChange={(event) => {
                  setContent(event.target.value.slice(0, 2_000));
                  setResult(null);
                }}
                className="min-h-[320px] text-sm leading-6"
                placeholder="Describe your product, topic, policy, service, or help content..."
              />
              <span className="text-xs text-muted-foreground">{content.length.toLocaleString()} / 2,000 characters</span>
            </label>
            <div className="grid content-start gap-4 rounded-3xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
              <div className="grid gap-2 text-sm font-medium">
                Number of FAQs
                <div className="grid grid-cols-4 gap-2">
                  {counts.map((item) => (
                    <Button key={item} type="button" variant={count === item ? "default" : "outline"} onClick={() => setCount(item)}>
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
              <label className="grid gap-2 text-sm font-medium">
                Language
                <select suppressHydrationWarning value={language} onChange={(event) => setLanguage(event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Tone
                <select suppressHydrationWarning value={tone} onChange={(event) => setTone(event.target.value as FaqTone)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {tones.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <HelpCircle className="text-blue-600" />
                <p className="mt-3 text-sm font-semibold">Publishing ready</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Export answers as Markdown or copy FAQPage JSON-LD for SEO-friendly structured data.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={!content.trim() || mutation.isPending} onClick={() => mutation.mutate({ content, count, language, tone })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Generate FAQs
            </Button>
            <Button size="lg" variant="outline" disabled={!content && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>FAQ metadata</CardTitle>
            <CardDescription>Generation details for publishing and AI context planning.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["FAQs", result ? result.count.toLocaleString() : count.toString()],
              ["Language", result?.language ?? language],
              ["Tone", result?.tone ?? tone],
              ["Words", result ? result.wordCount.toLocaleString() : "0"],
              ["Characters", result ? result.characterCount.toLocaleString() : "0"],
              ["Token estimate", result ? result.tokenEstimate.toLocaleString() : "0"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium capitalize">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Generated FAQs</CardTitle>
              <CardDescription>Review, copy, download, or export FAQPage schema.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={() => copyOutput()}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={() => download("siteclaud-faqs.md", result?.markdown)}><Download data-icon="inline-start" /> .md</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={() => copyOutput(result?.jsonLd)}><FileJson data-icon="inline-start" /> JSON-LD</Button>
              <Button variant="ghost" size="sm" disabled={!result} onClick={reset}><X data-icon="inline-start" /> Clear</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="editor">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="schema">Schema</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="mt-4">
                <Textarea value={activeOutput} readOnly className="min-h-[560px] resize-none font-mono text-sm leading-6" />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="min-h-[560px] overflow-auto rounded-2xl border border-border bg-muted/30 p-5 font-mono text-sm leading-7 whitespace-pre-wrap">{activeOutput}</div>
              </TabsContent>
              <TabsContent value="schema" className="mt-4">
                <div className={cn("min-h-[560px] overflow-auto rounded-2xl border border-border bg-muted/30 p-5 font-mono text-sm leading-7 whitespace-pre-wrap", !result && "text-muted-foreground")}>
                  {result?.jsonLd ?? "Generate FAQs to create FAQPage JSON-LD schema."}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
