"use client";

import { useMutation } from "@tanstack/react-query";
import { Clipboard, Copy, Download, Loader2, RotateCcw, Sparkles, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AiReplyGeneratorResponse, ReplyLength, ReplySource, ReplyStyle } from "@/types/conversion";

const sources: Array<{ value: ReplySource; label: string }> = [
  { value: "email", label: "Email" },
  { value: "linkedin-comment", label: "LinkedIn Comment" },
  { value: "linkedin-message", label: "LinkedIn Message" },
  { value: "x-tweet", label: "X Tweet" },
  { value: "x-reply", label: "X Reply" },
  { value: "facebook-post", label: "Facebook Post" },
  { value: "facebook-comment", label: "Facebook Comment" },
  { value: "instagram-comment", label: "Instagram Comment" },
  { value: "instagram-dm", label: "Instagram DM" },
  { value: "youtube-comment", label: "YouTube Comment" },
  { value: "reddit-comment", label: "Reddit Comment" },
  { value: "discord-message", label: "Discord Message" },
  { value: "slack-message", label: "Slack Message" },
  { value: "whatsapp-message", label: "WhatsApp Message" },
  { value: "text-message", label: "Text Message" },
  { value: "other", label: "Other" },
];

const styles: Array<{ value: ReplyStyle; label: string }> = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "formal", label: "Formal" },
  { value: "informal", label: "Informal" },
  { value: "witty", label: "Witty" },
  { value: "empathetic", label: "Empathetic" },
  { value: "confident", label: "Confident" },
  { value: "diplomatic", label: "Diplomatic" },
];

const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Hindi", "Arabic", "Chinese (Mandarin)", "Japanese", "Korean", "Dutch"];

async function generateReply(payload: {
  message: string;
  instructions: string;
  context: string;
  source: ReplySource;
  language: string;
  style: ReplyStyle;
  length: ReplyLength;
}) {
  const response = await fetch("/api/ai-reply-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Reply generation failed.");
  }

  return data as AiReplyGeneratorResponse;
}

export function AiReplyGenerator() {
  const [message, setMessage] = useState("Hi, I tried the product but I am not sure which plan is right for my team. Can you help?");
  const [instructions, setInstructions] = useState("Recommend a helpful next step and offer to answer questions.");
  const [context, setContext] = useState("We offer a free trial and a demo call.");
  const [source, setSource] = useState<ReplySource>("email");
  const [language, setLanguage] = useState("English");
  const [style, setStyle] = useState<ReplyStyle>("professional");
  const [length, setLength] = useState<ReplyLength>("shorter");
  const [result, setResult] = useState<AiReplyGeneratorResponse | null>(null);

  const mutation = useMutation({
    mutationFn: generateReply,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Reply generated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Reply generation failed."),
  });

  const activeReply = useMemo(
    () => result?.reply ?? "Your generated reply will appear here with alternate drafts, tone controls, and quick copy/download actions.",
    [result],
  );

  async function pasteMessage() {
    try {
      const text = await navigator.clipboard.readText();
      setMessage(text.slice(0, 4_000));
      setResult(null);
      toast.success("Pasted message from clipboard.");
    } catch {
      toast.error("Clipboard access was not available.");
    }
  }

  function copyReply(text = result?.reply) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied reply to clipboard.");
  }

  function downloadReply() {
    if (!result) return;
    const blob = new Blob([result.reply], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siteclaud-ai-reply.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setMessage("");
    setInstructions("");
    setContext("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI generator</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Reply Generator</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Generate thoughtful, context-aware replies for emails, social comments, DMs, support messages, and professional conversations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium">What is the message you are replying to?</p>
                <Button variant="outline" size="sm" onClick={pasteMessage}><Clipboard data-icon="inline-start" /> Paste</Button>
              </div>
              <Textarea value={message} onChange={(event) => setMessage(event.target.value.slice(0, 4_000))} className="min-h-[260px] text-sm leading-6" />
            </div>
            <div className="grid gap-4 rounded-3xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
              <label className="grid gap-2 text-sm font-medium">
                Source
                <select suppressHydrationWarning value={source} onChange={(event) => setSource(event.target.value as ReplySource)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {sources.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Language
                <select suppressHydrationWarning value={language} onChange={(event) => setLanguage(event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Writing style
                <select suppressHydrationWarning value={style} onChange={(event) => setStyle(event.target.value as ReplyStyle)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                  {styles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="grid gap-2 text-sm font-medium">
                Reply length
                <div className="grid grid-cols-2 gap-2">
                  {(["shorter", "longer"] as ReplyLength[]).map((item) => (
                    <Button key={item} type="button" variant={length === item ? "default" : "outline"} onClick={() => setLength(item)} className="capitalize">
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Reply instructions
              <Input value={instructions} onChange={(event) => setInstructions(event.target.value.slice(0, 1_500))} placeholder="Apologize, answer directly, ask for a meeting..." />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Additional context
              <Input value={context} onChange={(event) => setContext(event.target.value.slice(0, 1_500))} placeholder="Customer plan, policy, offer, deadline..." />
            </label>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={!message.trim() || mutation.isPending} onClick={() => mutation.mutate({ message, instructions, context, source, language, style, length })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Generate reply
            </Button>
            <Button size="lg" variant="outline" disabled={!message && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Reply settings</CardTitle>
            <CardDescription>Draft metadata for fast review before sending.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Source", source.replace(/-/g, " ")],
              ["Language", result?.language ?? language],
              ["Style", result?.style ?? style],
              ["Length", result?.length ?? length],
              ["Words", result ? result.wordCount.toLocaleString() : "0"],
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
              <CardTitle>Generated reply</CardTitle>
              <CardDescription>Use the main draft or copy one of the alternate versions.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={() => copyReply()}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={downloadReply}><Download data-icon="inline-start" /> TXT</Button>
              <Button variant="ghost" size="sm" disabled={!result} onClick={reset}><X data-icon="inline-start" /> Clear</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="main">
              <TabsList>
                <TabsTrigger value="main">Main draft</TabsTrigger>
                <TabsTrigger value="alternates">Alternates</TabsTrigger>
              </TabsList>
              <TabsContent value="main" className="mt-4">
                <Textarea value={activeReply} readOnly className="min-h-[440px] resize-none text-sm leading-6" />
              </TabsContent>
              <TabsContent value="alternates" className="mt-4">
                <div className="grid gap-3">
                  {(result?.alternatives.length ? result.alternatives : ["Generate a reply to see alternate drafts."]).map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-2xl border border-border bg-muted/30 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <Badge variant="secondary">Draft {index + 1}</Badge>
                        <Button variant="outline" size="sm" disabled={!result} onClick={() => copyReply(item)}><Copy data-icon="inline-start" /> Copy</Button>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-7">{item}</p>
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
