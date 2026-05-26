"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Download, Loader2, Mail, RotateCcw, Sparkles, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AiEmailResponseGeneratorResponse, EmailTone } from "@/types/conversion";

const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Hindi", "Arabic", "Chinese (Mandarin)", "Japanese", "Korean", "Dutch", "Gujarati", "Tamil", "Telugu", "Urdu", "Vietnamese", "Welsh"];
const tones: Array<{ value: EmailTone; label: string }> = [
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

async function generateEmail(payload: {
  receivedEmail: string;
  subject: string;
  responseGoal: string;
  sender: string;
  recipient: string;
  language: string;
  tone: EmailTone;
}) {
  const response = await fetch("/api/ai-email-response-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Email response generation failed.");
  }

  return data as AiEmailResponseGeneratorResponse;
}

export function AiEmailResponseGenerator() {
  const [receivedEmail, setReceivedEmail] = useState("Hi, I am interested in Siteclaud but I am not sure whether it can convert our help center and support docs into Markdown for chatbot training. Can you share how it works and whether there is a trial?");
  const [subject, setSubject] = useState("Question about Siteclaud");
  const [responseGoal, setResponseGoal] = useState("Explain that Siteclaud can convert website and document content into Markdown, mention the free trial, and offer a demo.");
  const [sender, setSender] = useState("Alex");
  const [recipient, setRecipient] = useState("Jordan");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState<EmailTone>("professional");
  const [result, setResult] = useState<AiEmailResponseGeneratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: generateEmail,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Email response generated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Email response generation failed."),
  });

  const activeEmail = useMemo(
    () => result?.email ?? "Your generated email response will appear here. Paste a received email, set the goal, sender, recipient, language, and tone, then generate a polished reply.",
    [result],
  );

  function copyEmail(value = result?.email) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied email response to clipboard.");
  }

  function downloadEmail() {
    if (!result) return;
    const blob = new Blob([result.email], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siteclaud-email-response.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setReceivedEmail("");
    setSubject("");
    setResponseGoal("");
    setSender("");
    setRecipient("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI generator</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Email Response Generator</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Create professional, personalized email replies from any received email, response goal, and tone.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <label className="grid gap-2 text-sm font-medium">
              Received Email
              <Textarea
                value={receivedEmail}
                onChange={(event) => {
                  setReceivedEmail(event.target.value.slice(0, 4_000));
                  setResult(null);
                }}
                className="min-h-[320px] text-sm leading-6"
                placeholder="Paste the email you received..."
              />
              <span className="text-xs text-muted-foreground">{receivedEmail.length.toLocaleString()} / 4,000 characters</span>
            </label>
            <div className="grid content-start gap-4 rounded-3xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
              <label className="grid gap-2 text-sm font-medium">
                Subject
                <Input value={subject} onChange={(event) => setSubject(event.target.value.slice(0, 200))} placeholder="Subject of the received email" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Response Goal
                <Textarea value={responseGoal} onChange={(event) => setResponseGoal(event.target.value.slice(0, 1_000))} className="min-h-24 text-sm leading-6" placeholder="What should the reply accomplish?" />
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
                  <select suppressHydrationWarning value={tone} onChange={(event) => setTone(event.target.value as EmailTone)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                    {tones.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
              </div>
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <Mail className="text-blue-600" />
                <p className="mt-3 text-sm font-semibold">Reply-ready format</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The output includes a reply subject, greeting, response body, close, and quick drafting notes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={!receivedEmail.trim() || !responseGoal.trim() || mutation.isPending} onClick={() => mutation.mutate({ receivedEmail, subject, responseGoal, sender, recipient, language, tone })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Generate Email Response
            </Button>
            <Button size="lg" variant="outline" disabled={!receivedEmail && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Email metadata</CardTitle>
            <CardDescription>Draft details and response quality notes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Subject", result?.subject ?? (subject || "Waiting for draft")],
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
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Draft notes</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6">
                {(result?.notes ?? ["Generate an email response to see drafting notes."]).map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Generated email response</CardTitle>
              <CardDescription>Review, copy, or download the finished reply.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={() => copyEmail()}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={downloadEmail}><Download data-icon="inline-start" /> TXT</Button>
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
                <Textarea value={activeEmail} readOnly className="min-h-[560px] resize-none font-mono text-sm leading-6" />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="min-h-[560px] overflow-auto rounded-2xl border border-border bg-muted/30 p-5 font-mono text-sm leading-7 whitespace-pre-wrap">{activeEmail}</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
