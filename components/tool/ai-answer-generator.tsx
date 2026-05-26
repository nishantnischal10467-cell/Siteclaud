"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Download, HelpCircle, Loader2, RotateCcw, Sparkles, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AiAnswerGeneratorResponse, AnswerTone } from "@/types/conversion";

const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Hindi", "Arabic", "Chinese (Mandarin)", "Japanese", "Korean", "Dutch", "Gujarati", "Tamil", "Telugu", "Urdu", "Vietnamese", "Welsh"];
const tones: Array<{ value: AnswerTone; label: string }> = [
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

async function generateAnswer(payload: {
  question: string;
  language: string;
  tone: AnswerTone;
}) {
  const response = await fetch("/api/ai-answer-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Answer generation failed.");
  }

  return data as AiAnswerGeneratorResponse;
}

export function AiAnswerGenerator() {
  const [question, setQuestion] = useState("How can a support team use website content to train a more accurate AI chatbot?");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState<AnswerTone>("professional");
  const [result, setResult] = useState<AiAnswerGeneratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: generateAnswer,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Answer generated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Answer generation failed."),
  });

  const activeAnswer = useMemo(
    () => result?.answer ?? "Your generated answer will appear here. Ask a question, choose a language and tone, then generate a structured response with key points and follow-up questions.",
    [result],
  );

  function copyAnswer(value = result?.answer) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied answer to clipboard.");
  }

  function downloadAnswer() {
    if (!result) return;
    const blob = new Blob([result.answer], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siteclaud-ai-answer.md";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setQuestion("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI generator</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Answer Generator</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Get instant, structured answers to questions in the language and tone that fit your workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <label className="grid gap-2 text-sm font-medium">
              Ask your question
              <Textarea
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value.slice(0, 1_500));
                  setResult(null);
                }}
                className="min-h-[280px] text-sm leading-6"
                placeholder="Type any question here..."
              />
              <span className="text-xs text-muted-foreground">{question.length.toLocaleString()} / 1,500 characters</span>
            </label>
            <div className="grid content-start gap-4 rounded-3xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
              <label className="grid gap-2 text-sm font-medium">
                Language
                <select suppressHydrationWarning value={language} onChange={(event) => setLanguage(event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Tone
                <select suppressHydrationWarning value={tone} onChange={(event) => setTone(event.target.value as AnswerTone)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {tones.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <HelpCircle className="text-blue-600" />
                <p className="mt-3 text-sm font-semibold">Structured response</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Answers include a direct response, key points, a suggested next step, and follow-up questions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={!question.trim() || mutation.isPending} onClick={() => mutation.mutate({ question, language, tone })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Generate Answer
            </Button>
            <Button size="lg" variant="outline" disabled={!question && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Answer metadata</CardTitle>
            <CardDescription>Generation details and useful follow-up prompts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
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
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Follow-up questions</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6">
                {(result?.followUps ?? ["Generate an answer to see suggested follow-up questions."]).map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Generated answer</CardTitle>
              <CardDescription>Review, copy, or download the structured answer.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={() => copyAnswer()}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={downloadAnswer}><Download data-icon="inline-start" /> .md</Button>
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
                <Textarea value={activeAnswer} readOnly className="min-h-[560px] resize-none font-mono text-sm leading-6" />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="min-h-[560px] overflow-auto rounded-2xl border border-border bg-muted/30 p-5 font-mono text-sm leading-7 whitespace-pre-wrap">{activeAnswer}</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
