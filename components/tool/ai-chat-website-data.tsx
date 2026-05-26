"use client";

import { useMutation } from "@tanstack/react-query";
import { Bot, Copy, Download, Globe2, Link2, Loader2, MessageSquareText, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AiChatWebsiteDataResponse } from "@/types/conversion";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

async function askWebsiteData(payload: { url: string; question: string }) {
  const response = await fetch("/api/ai-chat-website-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Website chat failed.");
  }

  return data as AiChatWebsiteDataResponse;
}

export function AiChatWebsiteData() {
  const [url, setUrl] = useState("https://siteclaud.com");
  const [question, setQuestion] = useState("What does this website help users do?");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [result, setResult] = useState<AiChatWebsiteDataResponse | null>(null);

  const mutation = useMutation({
    mutationFn: askWebsiteData,
    onSuccess: (data, variables) => {
      setResult(data);
      setMessages((current) => [
        ...current,
        { role: "user", content: variables.question },
        { role: "assistant", content: data.answer },
      ]);
      setQuestion("");
      toast.success("Answer generated from the webpage.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Website chat failed."),
  });

  const exportText = useMemo(() => {
    if (!messages.length) return "Ask a question to start a grounded chat with a webpage.";
    return [
      `# Website Chat: ${result?.title ?? url}`,
      result?.url ? `Source: ${result.url}` : "",
      "",
      messages.map((message) => `**${message.role === "user" ? "You" : "Siteclaud AI"}**\n\n${message.content}`).join("\n\n---\n\n"),
    ].filter(Boolean).join("\n");
  }, [messages, result, url]);

  function submitQuestion(nextQuestion = question) {
    const trimmed = nextQuestion.trim();
    if (!trimmed || mutation.isPending) return;
    setMessages((current) => current.length && result?.url === url ? current : []);
    mutation.mutate({ url, question: trimmed });
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
    link.download = "siteclaud-website-data-chat.md";
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
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">AI Chat with Your Website Data</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Enter a webpage URL, extract its readable content, and ask source-backed questions about the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-3xl border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Globe2 className="text-blue-600" /> Website source</CardTitle>
                <CardDescription>Paste a public webpage URL and ask questions from its extracted content.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <label className="grid gap-2 text-sm font-medium">
                  URL
                  <Input
                    value={url}
                    onChange={(event) => {
                      setUrl(event.target.value.slice(0, 2_000));
                      setResult(null);
                      setMessages([]);
                    }}
                    placeholder="https://example.com/page"
                  />
                </label>
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <div className="flex items-start gap-3">
                    <Link2 className="mt-1 text-blue-600" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{result?.title ?? "Waiting for webpage"}</p>
                      <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
                        {result?.description || "Ask a question to fetch readable webpage content and generate source-backed answers."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Words", result ? result.wordCount.toLocaleString() : "0"],
                    ["Tokens", result ? result.tokenEstimate.toLocaleString() : "0"],
                    ["Confidence", result?.confidence ?? "waiting"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                      <p className="mt-1 text-sm font-semibold capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg"><MessageSquareText className="text-blue-600" /> Chat</CardTitle>
                  <CardDescription>Answers are generated from the extracted webpage content.</CardDescription>
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
                      <p className="max-w-sm text-sm leading-6 text-muted-foreground">Enter a URL and ask a question. Siteclaud will fetch the page, extract readable content, and answer from that source.</p>
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
                    placeholder="Ask a question about the webpage..."
                  />
                  <Button disabled={!url.trim() || !question.trim() || mutation.isPending} onClick={() => submitQuestion()}>
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
            <CardTitle>Suggested questions</CardTitle>
            <CardDescription>Use these after the first answer to keep exploring the page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {(result?.suggestedQuestions ?? ["What does this page offer?", "Summarize the main points.", "What are the strongest customer benefits?"]).map((item) => (
              <Button key={item} variant="outline" className="h-auto justify-start whitespace-normal text-left" onClick={() => {
                setQuestion(item);
                submitQuestion(item);
              }}>
                {item}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Evidence and export</CardTitle>
            <CardDescription>Review matched source excerpts or export the chat transcript.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="evidence">
              <TabsList>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              </TabsList>
              <TabsContent value="evidence" className="mt-4">
                <div className="grid gap-3">
                  {(result?.evidence.length ? result.evidence : [{ excerpt: "Ask a question to see matched webpage excerpts.", score: 0 }]).map((item, index) => (
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
