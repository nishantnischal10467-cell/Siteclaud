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
import type { AiLetterGeneratorResponse, LetterTone, LetterType } from "@/types/conversion";

const letterTypes: Array<{ value: LetterType; label: string }> = [
  { value: "cover-letter", label: "Cover Letter" },
  { value: "business-letter", label: "Business Letter" },
  { value: "thank-you-letter", label: "Thank You Letter" },
  { value: "apology-letter", label: "Apology Letter" },
  { value: "recommendation-letter", label: "Recommendation Letter" },
  { value: "resignation-letter", label: "Resignation Letter" },
  { value: "complaint-letter", label: "Complaint Letter" },
  { value: "invitation-letter", label: "Invitation Letter" },
  { value: "sales-letter", label: "Sales Letter" },
  { value: "personal-letter", label: "Personal Letter" },
  { value: "other", label: "Other" },
];

const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Hindi", "Arabic", "Chinese (Mandarin)", "Japanese", "Korean", "Dutch", "Gujarati", "Tamil", "Telugu", "Urdu", "Vietnamese", "Welsh"];
const tones: Array<{ value: LetterTone; label: string }> = [
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

async function generateLetter(payload: {
  type: LetterType;
  description: string;
  sender: string;
  recipient: string;
  language: string;
  tone: LetterTone;
}) {
  const response = await fetch("/api/ai-letter-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Letter generation failed.");
  }

  return data as AiLetterGeneratorResponse;
}

export function AiLetterGenerator() {
  const [type, setType] = useState<LetterType>("business-letter");
  const [description, setDescription] = useState("Write a letter to a potential partner explaining that Siteclaud can turn websites and documents into clean Markdown for AI workflows, and invite them to schedule a demo.");
  const [sender, setSender] = useState("Alex Morgan");
  const [recipient, setRecipient] = useState("Jordan Lee");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState<LetterTone>("professional");
  const [result, setResult] = useState<AiLetterGeneratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: generateLetter,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Letter generated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Letter generation failed."),
  });

  const activeLetter = useMemo(
    () => result?.letter ?? "Your generated letter will appear here. Choose a letter type, describe what it should say, add sender and recipient details, then generate a polished draft.",
    [result],
  );

  function copyLetter(value = result?.letter) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied letter to clipboard.");
  }

  function downloadLetter() {
    if (!result) return;
    const blob = new Blob([result.letter], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siteclaud-ai-letter.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setDescription("");
    setSender("");
    setRecipient("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI generator</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Letter Generator</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Create polished personal, business, cover, apology, recommendation, and invitation letters in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <label className="grid gap-2 text-sm font-medium">
              Letter Description
              <Textarea
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value.slice(0, 3_000));
                  setResult(null);
                }}
                className="min-h-[320px] text-sm leading-6"
                placeholder="Describe what the letter should say..."
              />
              <span className="text-xs text-muted-foreground">{description.length.toLocaleString()} / 3,000 characters</span>
            </label>
            <div className="grid content-start gap-4 rounded-3xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
              <label className="grid gap-2 text-sm font-medium">
                Type of Letter
                <select suppressHydrationWarning value={type} onChange={(event) => setType(event.target.value as LetterType)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {letterTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Sender
                  <Input value={sender} onChange={(event) => setSender(event.target.value.slice(0, 120))} placeholder="Your name" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Recipient
                  <Input value={recipient} onChange={(event) => setRecipient(event.target.value.slice(0, 120))} placeholder="Recipient name" />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Language
                  <select suppressHydrationWarning value={language} onChange={(event) => setLanguage(event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                    {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Tone
                  <select suppressHydrationWarning value={tone} onChange={(event) => setTone(event.target.value as LetterTone)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                    {tones.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
              </div>
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <FileText className="text-blue-600" />
                <p className="mt-3 text-sm font-semibold">Letter-ready format</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The output includes a clear title, greeting, context, practical next step, closing, and drafting notes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={!description.trim() || mutation.isPending} onClick={() => mutation.mutate({ type, description, sender, recipient, language, tone })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Generate Letter
            </Button>
            <Button size="lg" variant="outline" disabled={!description && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Letter metadata</CardTitle>
            <CardDescription>Draft details and quality notes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Title", result?.title ?? "Waiting for draft"],
              ["Type", result?.type.replace(/-/g, " ") ?? type.replace(/-/g, " ")],
              ["Language", result?.language ?? language],
              ["Tone", result?.tone ?? tone],
              ["Words", result ? result.wordCount.toLocaleString() : "0"],
              ["Token estimate", result ? result.tokenEstimate.toLocaleString() : "0"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium capitalize">{value}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Draft notes</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6">
                {(result?.notes ?? ["Generate a letter to see drafting notes."]).map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Generated letter</CardTitle>
              <CardDescription>Review, copy, or download the finished draft.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={() => copyLetter()}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={downloadLetter}><Download data-icon="inline-start" /> TXT</Button>
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
                <Textarea value={activeLetter} readOnly className="min-h-[560px] resize-none font-mono text-sm leading-6" />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="min-h-[560px] overflow-auto rounded-2xl border border-border bg-muted/30 p-5 font-mono text-sm leading-7 whitespace-pre-wrap">{activeLetter}</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
