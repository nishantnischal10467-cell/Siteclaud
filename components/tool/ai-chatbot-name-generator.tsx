"use client";

import { useMutation } from "@tanstack/react-query";
import { Bot, Copy, Download, Loader2, RotateCcw, Sparkles, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AiChatbotNameGeneratorResponse, ChatbotIndustry, ChatbotNameTone } from "@/types/conversion";

const tones: Array<{ value: ChatbotNameTone; label: string }> = [
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

const industries: Array<{ value: ChatbotIndustry; label: string }> = [
  { value: "agriculture", label: "Agriculture" },
  { value: "automotive", label: "Automotive" },
  { value: "construction", label: "Construction" },
  { value: "crypto", label: "Crypto" },
  { value: "customer-support", label: "Customer Support" },
  { value: "cybersecurity", label: "CyberSecurity" },
  { value: "dating", label: "Dating" },
  { value: "e-commerce", label: "E-commerce" },
  { value: "education", label: "Education" },
  { value: "energy", label: "Energy" },
  { value: "entertainment", label: "Entertainment" },
  { value: "environmental", label: "Environmental" },
  { value: "fashion", label: "Fashion" },
  { value: "finance", label: "Finance" },
  { value: "food-and-beverage", label: "Food and Beverage" },
  { value: "gaming", label: "Gaming" },
  { value: "government", label: "Government" },
  { value: "healthcare", label: "Healthcare" },
  { value: "hospitality", label: "Hospitality" },
  { value: "insurance", label: "Insurance" },
  { value: "legal", label: "Legal" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "marketing", label: "Marketing" },
  { value: "media", label: "Media" },
  { value: "non-profit", label: "Non-Profit" },
  { value: "pharmaceuticals", label: "Pharmaceuticals" },
  { value: "real-estate", label: "Real Estate" },
  { value: "software", label: "Software" },
  { value: "sports", label: "Sports" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "transportation", label: "Transportation" },
  { value: "travel", label: "Travel" },
  { value: "web3", label: "Web3" },
];

async function generateNames(payload: {
  keywords: string;
  description: string;
  tone: ChatbotNameTone;
  industry: ChatbotIndustry;
  prefix: string;
  suffix: string;
}) {
  const response = await fetch("/api/ai-chatbot-name-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Chatbot name generation failed.");
  }

  return data as AiChatbotNameGeneratorResponse;
}

export function AiChatbotNameGenerator() {
  const [keywords, setKeywords] = useState("support, knowledge base, documentation");
  const [description, setDescription] = useState("A helpful AI chatbot that answers customer questions from website content and support documentation.");
  const [tone, setTone] = useState<ChatbotNameTone>("friendly");
  const [industry, setIndustry] = useState<ChatbotIndustry>("customer-support");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("AI");
  const [result, setResult] = useState<AiChatbotNameGeneratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: generateNames,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Chatbot names generated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Chatbot name generation failed."),
  });

  const activeOutput = useMemo(
    () => result?.markdown ?? "Generated chatbot name ideas will appear here. Add keywords, describe your bot, choose tone and industry, then generate memorable names.",
    [result],
  );

  function copyOutput(value = result?.markdown) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied chatbot names to clipboard.");
  }

  function downloadNames() {
    if (!result) return;
    const blob = new Blob([result.markdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siteclaud-chatbot-names.md";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setKeywords("");
    setDescription("");
    setPrefix("");
    setSuffix("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI generator</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Chatbot Name Generator</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Generate unique, memorable chatbot names with the right tone, industry fit, and brand personality.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                Keywords
                <Input value={keywords} onChange={(event) => setKeywords(event.target.value.slice(0, 500))} placeholder="support, sales, docs, finance..." />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Chatbot Description
                <Textarea
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value.slice(0, 2_000));
                    setResult(null);
                  }}
                  className="min-h-[260px] text-sm leading-6"
                  placeholder="Describe what your chatbot does and who it helps..."
                />
                <span className="text-xs text-muted-foreground">{description.length.toLocaleString()} / 2,000 characters</span>
              </label>
            </div>
            <div className="grid content-start gap-4 rounded-3xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
              <label className="grid gap-2 text-sm font-medium">
                Tone
                <select suppressHydrationWarning value={tone} onChange={(event) => setTone(event.target.value as ChatbotNameTone)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {tones.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Industry
                <select suppressHydrationWarning value={industry} onChange={(event) => setIndustry(event.target.value as ChatbotIndustry)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {industries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Prefix
                  <Input value={prefix} onChange={(event) => setPrefix(event.target.value.slice(0, 24))} placeholder="Site" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Suffix
                  <Input value={suffix} onChange={(event) => setSuffix(event.target.value.slice(0, 24))} placeholder="AI" />
                </label>
              </div>
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <Bot className="text-blue-600" />
                <p className="mt-3 text-sm font-semibold">Brand-ready naming</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Names include style labels, quick scores, and short rationale to help you pick a bot identity.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={(!keywords.trim() && !description.trim()) || mutation.isPending} onClick={() => mutation.mutate({ keywords, description, tone, industry, prefix, suffix })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Generate Chatbot Names
            </Button>
            <Button size="lg" variant="outline" disabled={!keywords && !description && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Name metadata</CardTitle>
            <CardDescription>Generation details for brand and product review.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Names", result ? result.names.length.toLocaleString() : "0"],
              ["Keywords", result ? result.keywordCount.toLocaleString() : "0"],
              ["Tone", result?.tone ?? tone],
              ["Industry", (result?.industry ?? industry).replace(/-/g, " ")],
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
              <CardTitle>Generated chatbot names</CardTitle>
              <CardDescription>Review, copy, or download name ideas.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={() => copyOutput()}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={downloadNames}><Download data-icon="inline-start" /> .md</Button>
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
                  {(result?.names.length ? result.names : [{ name: "Generate names to see ranked chatbot identities.", style: "Waiting", rationale: "Add details and generate names.", score: 0 }]).map((item) => (
                    <div key={`${item.name}-${item.style}`} className="rounded-2xl border border-border bg-muted/30 p-4">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{item.style}</Badge>
                        <Badge variant="outline">{item.score}/100</Badge>
                      </div>
                      <p className="text-lg font-semibold leading-7">{item.name}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.rationale}</p>
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
