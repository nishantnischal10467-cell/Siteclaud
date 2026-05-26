"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Download, Loader2, RotateCcw, Sparkles, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AiPromptGeneratorResponse, PromptFramework, PromptLength, PromptTone } from "@/types/conversion";

const frameworks: Array<{ value: PromptFramework; label: string; description: string }> = [
  { value: "ape", label: "APE", description: "Action, Purpose, Expectation" },
  { value: "tag", label: "TAG", description: "Task, Action, Goal" },
  { value: "race", label: "RACE", description: "Role, Action, Context, Expectation" },
  { value: "care", label: "CARE", description: "Context, Action, Result, Example" },
  { value: "rise", label: "RISE", description: "Role, Input, Steps, Expectation" },
  { value: "era", label: "ERA", description: "Expectation, Role, Action" },
  { value: "create", label: "CREATE", description: "Advanced creative prompt structure" },
  { value: "trace", label: "TRACE", description: "Comprehensive complex task prompts" },
  { value: "roses", label: "ROSES", description: "Scenario-based problem solving" },
  { value: "spark", label: "SPARK", description: "Strategic problem-solving prompts" },
];

const tones: Array<{ value: PromptTone; label: string }> = [
  { value: "clear", label: "Clear" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
  { value: "technical", label: "Technical" },
  { value: "friendly", label: "Friendly" },
  { value: "academic", label: "Academic" },
  { value: "persuasive", label: "Persuasive" },
  { value: "strategic", label: "Strategic" },
];

async function generatePrompt(payload: {
  framework: PromptFramework;
  task: string;
  goal: string;
  context: string;
  audience: string;
  output: string;
  tone: PromptTone;
  length: PromptLength;
}) {
  const response = await fetch("/api/ai-prompt-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Prompt generation failed.");
  }

  return data as AiPromptGeneratorResponse;
}

export function AiPromptGenerator() {
  const [framework, setFramework] = useState<PromptFramework>("ape");
  const [task, setTask] = useState("Create a customer support chatbot training plan for a SaaS website.");
  const [goal, setGoal] = useState("Help the team launch a reliable AI assistant with accurate answers and clear escalation paths.");
  const [context, setContext] = useState("The website has help docs, pricing pages, onboarding guides, and support policies.");
  const [audience, setAudience] = useState("Customer support and growth teams");
  const [output, setOutput] = useState("Return a prioritized checklist with examples and implementation notes.");
  const [tone, setTone] = useState<PromptTone>("professional");
  const [length, setLength] = useState<PromptLength>("detailed");
  const [result, setResult] = useState<AiPromptGeneratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: generatePrompt,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Prompt generated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Prompt generation failed."),
  });

  const activePrompt = useMemo(
    () => result?.prompt ?? "Your generated framework prompt will appear here. Choose a framework, describe the task and goal, then generate a structured prompt for ChatGPT, Claude, or other AI tools.",
    [result],
  );

  const selectedFramework = frameworks.find((item) => item.value === framework);

  function copyPrompt() {
    if (!result) return;
    navigator.clipboard.writeText(result.prompt);
    toast.success("Copied prompt to clipboard.");
  }

  function downloadPrompt() {
    if (!result) return;
    const blob = new Blob([result.prompt], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siteclaud-ai-prompt.md";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setTask("");
    setGoal("");
    setContext("");
    setAudience("");
    setOutput("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI generator</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Prompt Generator</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Create high-quality AI prompts with proven frameworks like APE, RACE, CREATE, TRACE, ROSES, and SPARK.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <div>
              <p className="text-sm font-medium">Prompt framework</p>
              <p className="mt-1 text-sm text-muted-foreground">{selectedFramework?.description}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {frameworks.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setFramework(item.value);
                    setResult(null);
                  }}
                  className={cn(
                    "rounded-2xl border border-border bg-background/70 p-3 text-left transition hover:border-primary hover:bg-blue-50/50 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]",
                    framework === item.value && "border-primary bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-200",
                  )}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                Task
                <Textarea value={task} onChange={(event) => setTask(event.target.value.slice(0, 2_000))} className="min-h-32 text-sm leading-6" placeholder="What should the AI do?" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Goal
                <Textarea value={goal} onChange={(event) => setGoal(event.target.value.slice(0, 1_500))} className="min-h-28 text-sm leading-6" placeholder="Why does this matter? What outcome should it achieve?" />
              </label>
            </div>
            <div className="grid gap-4 rounded-3xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
              <label className="grid gap-2 text-sm font-medium">
                Audience
                <Input value={audience} onChange={(event) => setAudience(event.target.value.slice(0, 500))} placeholder="Who is this for?" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Tone
                <select suppressHydrationWarning value={tone} onChange={(event) => setTone(event.target.value as PromptTone)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm capitalize">
                  {tones.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="grid gap-2 text-sm font-medium">
                Prompt depth
                <div className="grid grid-cols-2 gap-2">
                  {(["concise", "detailed"] as PromptLength[]).map((item) => (
                    <Button key={item} type="button" variant={length === item ? "default" : "outline"} onClick={() => setLength(item)} className="capitalize">
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
              <label className="grid gap-2 text-sm font-medium">
                Expected output
                <Input value={output} onChange={(event) => setOutput(event.target.value.slice(0, 1_000))} placeholder="Checklist, table, JSON, summary..." />
              </label>
            </div>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Context
            <Textarea value={context} onChange={(event) => setContext(event.target.value.slice(0, 2_000))} className="min-h-28 text-sm leading-6" placeholder="Add constraints, background, examples, data, or source material..." />
          </label>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={!task.trim() || !goal.trim() || mutation.isPending} onClick={() => mutation.mutate({ framework, task, goal, context, audience, output, tone, length })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Generate Prompt
            </Button>
            <Button size="lg" variant="outline" disabled={!task && !goal && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Prompt metadata</CardTitle>
            <CardDescription>Framework details and context planning stats.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Framework", result?.framework ?? framework],
              ["Tone", result?.tone ?? tone],
              ["Depth", result?.length ?? length],
              ["Sections", result ? result.sections.toLocaleString() : "0"],
              ["Words", result ? result.wordCount.toLocaleString() : "0"],
              ["Token estimate", result ? result.tokenEstimate.toLocaleString() : "0"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium uppercase">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Generated prompt</CardTitle>
              <CardDescription>Copy this into ChatGPT, Claude, Gemini, or your AI workflow.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={copyPrompt}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={downloadPrompt}><Download data-icon="inline-start" /> .md</Button>
              <Button variant="ghost" size="sm" disabled={!result} onClick={reset}><X data-icon="inline-start" /> Clear</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="editor">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="mt-4">
                <Textarea value={activePrompt} readOnly className="min-h-[520px] resize-none font-mono text-sm leading-6" />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="min-h-[520px] overflow-auto rounded-2xl border border-border bg-muted/30 p-5 font-mono text-sm leading-7 whitespace-pre-wrap">{activePrompt}</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
