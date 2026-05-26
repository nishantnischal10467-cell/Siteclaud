"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Download, FileText, Loader2, RotateCcw, Sparkles, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AiBlogTitleGeneratorResponse, BlogTitleTone } from "@/types/conversion";

const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Hindi", "Arabic", "Chinese (Mandarin)", "Japanese", "Korean", "Dutch", "Gujarati", "Tamil", "Telugu", "Urdu", "Vietnamese", "Welsh"];
const tones: Array<{ value: BlogTitleTone; label: string }> = [
  { value: "approachable", label: "Approachable" },
  { value: "authoritative", label: "Authoritative" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "excited", label: "Excited" },
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "funny", label: "Funny" },
  { value: "informal", label: "Informal" },
  { value: "innovative", label: "Innovative" },
  { value: "inspirational", label: "Inspirational" },
  { value: "neutral", label: "Neutral" },
  { value: "optimistic", label: "Optimistic" },
  { value: "persuasive", label: "Persuasive" },
  { value: "pessimistic", label: "Pessimistic" },
  { value: "professional", label: "Professional" },
  { value: "thoughtful", label: "Thoughtful" },
];

async function generateTitles(payload: {
  keywords: string;
  summary: string;
  audience: string;
  language: string;
  tone: BlogTitleTone;
}) {
  const response = await fetch("/api/ai-blog-title-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Blog title generation failed.");
  }

  return data as AiBlogTitleGeneratorResponse;
}

export function AiBlogTitleGenerator() {
  const [keywords, setKeywords] = useState("AI chatbot training, markdown conversion, support automation");
  const [summary, setSummary] = useState("A practical article about turning website and document content into clean Markdown that teams can use to train AI chatbots and automate support workflows.");
  const [audience, setAudience] = useState("SaaS founders and support teams");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState<BlogTitleTone>("professional");
  const [result, setResult] = useState<AiBlogTitleGeneratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: generateTitles,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Blog titles generated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Blog title generation failed."),
  });

  const activeOutput = useMemo(
    () => result?.markdown ?? "Generated blog title ideas will appear here. Add keywords, a short summary, and your target audience to create SEO-friendly headline options.",
    [result],
  );

  function copyOutput(value = result?.markdown) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied blog titles to clipboard.");
  }

  function downloadTitles() {
    if (!result) return;
    const blob = new Blob([result.markdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siteclaud-blog-titles.md";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setKeywords("");
    setSummary("");
    setAudience("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI generator</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Blog Title Generator</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Create catchy, SEO-friendly blog titles from keywords, article summaries, audiences, languages, and tones.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                Keywords
                <Input value={keywords} onChange={(event) => setKeywords(event.target.value.slice(0, 500))} placeholder="AI chatbot, Markdown, customer support" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Blog Summary
                <Textarea
                  value={summary}
                  onChange={(event) => {
                    setSummary(event.target.value.slice(0, 2_000));
                    setResult(null);
                  }}
                  className="min-h-[240px] text-sm leading-6"
                  placeholder="Summarize the blog post you want titles for..."
                />
                <span className="text-xs text-muted-foreground">{summary.length.toLocaleString()} / 2,000 characters</span>
              </label>
            </div>
            <div className="grid content-start gap-4 rounded-3xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
              <label className="grid gap-2 text-sm font-medium">
                Target Audience
                <Input value={audience} onChange={(event) => setAudience(event.target.value.slice(0, 500))} placeholder="Who should click this article?" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Language
                <select suppressHydrationWarning value={language} onChange={(event) => setLanguage(event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Tone
                <select suppressHydrationWarning value={tone} onChange={(event) => setTone(event.target.value as BlogTitleTone)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {tones.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <FileText className="text-blue-600" />
                <p className="mt-3 text-sm font-semibold">SEO-ready angles</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Titles include angle labels and quick scores for scanning, prioritizing, and editorial planning.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={(!keywords.trim() && !summary.trim()) || mutation.isPending} onClick={() => mutation.mutate({ keywords, summary, audience, language, tone })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Generate Blog Titles
            </Button>
            <Button size="lg" variant="outline" disabled={!keywords && !summary && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Title metadata</CardTitle>
            <CardDescription>Generation details for SEO and editorial planning.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Titles", result ? result.titles.length.toLocaleString() : "0"],
              ["Keywords", result ? result.keywordCount.toLocaleString() : "0"],
              ["Language", result?.language ?? language],
              ["Tone", result?.tone ?? tone],
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
              <CardTitle>Generated blog titles</CardTitle>
              <CardDescription>Review, copy, or download headline ideas.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={() => copyOutput()}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={downloadTitles}><Download data-icon="inline-start" /> .md</Button>
              <Button variant="ghost" size="sm" disabled={!result} onClick={reset}><X data-icon="inline-start" /> Clear</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="editor">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="mt-4">
                <Textarea value={activeOutput} readOnly className="min-h-[560px] resize-none font-mono text-sm leading-6" />
              </TabsContent>
              <TabsContent value="cards" className="mt-4">
                <div className="grid gap-3">
                  {(result?.titles.length ? result.titles : [{ title: "Generate titles to see ranked headline cards.", angle: "Waiting", score: 0 }]).map((item) => (
                    <div key={`${item.title}-${item.angle}`} className="rounded-2xl border border-border bg-muted/30 p-4">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{item.angle}</Badge>
                        <Badge variant="outline">{item.score}/100</Badge>
                      </div>
                      <p className="text-base font-semibold leading-7">{item.title}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
