"use client";

import { useMutation } from "@tanstack/react-query";
import { Bot, Copy, DatabaseZap, Download, Loader2, MessageSquareText, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AiChatTextDataResponse } from "@/types/conversion";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

async function askTextData(payload: { text: string; question: string }) {
  const response = await fetch("/api/ai-chat-text-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Text chat failed.");
  }

  return data as AiChatTextDataResponse;
}

export function AiChatTextData() {
  const [text, setText] = useState(
    "Siteclaud converts webpages, documents, and pasted content into clean Markdown for AI workflows. Teams use it to train chatbots, create documentation, summarize source material, and keep support answers grounded in trusted content. The platform includes conversion history, API access, and tools for generating prompts, replies, FAQs, and brand names.",
  );
  const [question, setQuestion] = useState("How can teams use Siteclaud for support automation?");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [result, setResult] = useState<AiChatTextDataResponse | null>(null);

  const mutation = useMutation({
    mutationFn: askTextData,
    onSuccess: (data, variables) => {
      setResult(data);
      setMessages((current) => [
        ...current,
        { role: "user", content: variables.question },
        { role: "assistant", content: data.answer },
      ]);
      setQuestion("");
      toast.success("Answer generated from your text.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Text chat failed."),
  });

  const exportText = useMemo(() => {
    if (!messages.length) return "Ask a question to start a grounded chat with your pasted text.";
    return messages.map((message) => `**${message.role === "user" ? "You" : "Siteclaud AI"}**\n\n${message.content}`).join("\n\n---\n\n");
  }, [messages]);

  function submitQuestion(nextQuestion = question) {
    const trimmed = nextQuestion.trim();
    if (!trimmed || mutation.isPending) return;
    mutation.mutate({ text, question: trimmed });
  }

  function copyAnswer(value = result?.answer) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied answer to clipboard.");
  }

  function downloadChat() {
    const blob = new Blob([exportText], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "siteclaud-text-data-chat.md";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setMessages([]);
    setResult(null);
    setQuestion("");
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel overflow-hidden rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> AI chat tool</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Chat with Your Text Data</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Paste plain text, reports, transcripts, notes, or policies and ask focused questions with source-backed answers.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-3xl border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><DatabaseZap className="text-blue-600" /> Text data</CardTitle>
                <CardDescription>Paste up to 25,000 characters of source material.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Textarea
                  value={text}
                  onChange={(event) => {
                    setText(event.target.value.slice(0, 25_000));
                    setResult(null);
                    setMessages([]);
                  }}
                  className="min-h-[430px] resize-none bg-background/80 text-sm leading-6"
                  placeholder="Paste report, transcript, article, notes, policy, or documentation text..."
                />
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{text.length.toLocaleString()} / 25,000 chars</Badge>
                  <Badge variant="outline">{text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : "0"} words</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg"><MessageSquareText className="text-blue-600" /> Chat</CardTitle>
                  <CardDescription>Ask questions and keep the answer grounded in your text.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" disabled={!result} onClick={() => copyAnswer()}><Copy data-icon="inline-start" /> Copy</Button>
                  <Button variant="outline" size="sm" disabled={!messages.length} onClick={downloadChat}><Download data-icon="inline-start" /> .md</Button>
                  <Button variant="ghost" size="sm" disabled={!messages.length && !result} onClick={reset}><X data-icon="inline-start" /> Clear</Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="min-h-[360px] overflow-auto rounded-3xl border border-border bg-muted/30 p-4">
                  {messages.length ? (
                    <div className="grid gap-4">
                      {messages.map((message, index) => (
                        <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-[86%] rounded-2xl bg-blue-600 px-4 py-3 text-sm leading-6 text-white" : "mr-auto max-w-[92%] rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6"}>
                          <p className="mb-1 text-xs font-semibold opacity-70">{message.role === "user" ? "You" : "Siteclaud AI"}</p>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                      <Bot className="mb-4 text-blue-600" />
                      <p className="max-w-sm text-sm leading-6 text-muted-foreground">Paste text, ask a question, and the answer will appear here with matching source evidence.</p>
                    </div>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <Input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value.slice(0, 1_000))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") submitQuestion();
                    }}
                    placeholder="Ask a question about the pasted text..."
                  />
                  <Button disabled={!text.trim() || !question.trim() || mutation.isPending} onClick={() => submitQuestion()}>
                    {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Send data-icon="inline-start" />}
                    Ask
                  </Button>
                </div>
                <Button variant="outline" disabled={!messages.length && !question && !result} onClick={reset}>
                  <RotateCcw data-icon="inline-start" />
                  Reset Chat Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Source metadata</CardTitle>
            <CardDescription>Text size, answer confidence, and suggested follow-ups.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Words", result ? result.wordCount.toLocaleString() : text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : "0"],
              ["Characters", result ? result.characterCount.toLocaleString() : text.length.toLocaleString()],
              ["Token estimate", result ? result.tokenEstimate.toLocaleString() : Math.ceil(text.length / 4).toLocaleString()],
              ["Confidence", result?.confidence ?? "waiting"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium capitalize">{value}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Suggested questions</p>
              <div className="mt-3 grid gap-2">
                {(result?.suggestedQuestions ?? ["What are the main takeaways?", "Summarize this text.", "What should I ask next?"]).map((item) => (
                  <Button key={item} variant="outline" className="h-auto justify-start whitespace-normal text-left" onClick={() => {
                    setQuestion(item);
                    submitQuestion(item);
                  }}>
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Evidence and export</CardTitle>
            <CardDescription>Review matched excerpts or export the chat transcript.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="evidence">
              <TabsList>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              </TabsList>
              <TabsContent value="evidence" className="mt-4">
                <div className="grid gap-3">
                  {(result?.evidence.length ? result.evidence : [{ excerpt: "Ask a question to see the source excerpts used for the answer.", score: 0 }]).map((item, index) => (
                    <div key={`${item.score}-${index}`} className="rounded-2xl border border-border bg-muted/30 p-4">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="secondary">Excerpt {index + 1}</Badge>
                        <Badge variant="outline">Score {item.score}</Badge>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{item.excerpt}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="transcript" className="mt-4">
                <Textarea value={exportText} readOnly className="min-h-[520px] resize-none font-mono text-sm leading-6" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
