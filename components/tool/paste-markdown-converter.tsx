"use client";

import { useMutation } from "@tanstack/react-query";
import { Clipboard, Code2, Copy, Download, FileDown, Loader2, RotateCcw, Share2, Sparkles, Table2, TextCursorInput, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PasteConversionResponse, PasteFormat } from "@/types/conversion";

const LIMIT = 10_000;

const formats: Array<{ value: PasteFormat; label: string; icon: typeof WandSparkles }> = [
  { value: "auto", label: "Auto-detect", icon: WandSparkles },
  { value: "plain", label: "Plain text", icon: TextCursorInput },
  { value: "rich", label: "Rich text", icon: Sparkles },
  { value: "code", label: "Code block", icon: Code2 },
  { value: "table", label: "Table data", icon: Table2 },
];

async function convertPaste({ content, format }: { content: string; format: PasteFormat }) {
  const response = await fetch("/api/convert-paste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, format }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Paste conversion failed.");
  }

  return data as PasteConversionResponse;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function PasteMarkdownConverter() {
  const [content, setContent] = useState("Release notes\n\nAdded paste conversion, Markdown exports, and cleaner AI-ready formatting.");
  const [format, setFormat] = useState<PasteFormat>("auto");
  const [result, setResult] = useState<PasteConversionResponse | null>(null);

  const mutation = useMutation({
    mutationFn: convertPaste,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Paste converted to Markdown.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Paste conversion failed."),
  });

  const preview = useMemo(
    () => result?.markdown.slice(0, 2400) ?? "Converted Markdown will appear here. Paste plain text, rich HTML, code, or table-like data to normalize it for docs and AI workflows.",
    [result],
  );

  async function pasteFromClipboard() {
    try {
      const clipboard = navigator.clipboard;
      if ("read" in clipboard && typeof clipboard.read === "function") {
        const items = await clipboard.read();
        for (const item of items) {
          if (item.types.includes("text/html")) {
            const blob = await item.getType("text/html");
            setContent((await blob.text()).slice(0, LIMIT));
            setFormat("rich");
            setResult(null);
            toast.success("Pasted rich text from clipboard.");
            return;
          }
        }
      }

      const text = await navigator.clipboard.readText();
      setContent(text.slice(0, LIMIT));
      setResult(null);
      toast.success("Pasted text from clipboard.");
    } catch {
      toast.error("Clipboard access was not available.");
    }
  }

  function copyMarkdown() {
    if (!result) return;
    navigator.clipboard.writeText(result.markdown);
    toast.success("Copied Markdown to clipboard.");
  }

  function download(ext: "md" | "txt") {
    if (!result) return;
    const blob = new Blob([result.markdown], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `siteclaud-paste-export.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function clear() {
    setContent("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> Free AI tool</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">Convert Paste to Markdown</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Paste any text content and convert it into clean, well-formatted Markdown for emails, notes, tables, code snippets, documentation, and AI context.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-3">
            <p className="text-sm font-medium">Format type</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {formats.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFormat(item.value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-2xl border border-border bg-background/70 px-3 py-3 text-sm font-medium transition hover:border-primary hover:bg-blue-50/50 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]",
                    format === item.value && "border-primary bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-200",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{content.length.toLocaleString()} / {LIMIT.toLocaleString()} characters</p>
            <Button variant="outline" size="sm" onClick={pasteFromClipboard}><Clipboard data-icon="inline-start" /> Paste from clipboard</Button>
          </div>
          <Textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value.slice(0, LIMIT));
              setResult(null);
            }}
            className="min-h-[320px] font-mono text-sm leading-6"
            placeholder="Paste text, rich HTML, code, or table data here..."
          />
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={!content.trim() || mutation.isPending} onClick={() => mutation.mutate({ content, format })}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <WandSparkles data-icon="inline-start" />}
              Convert to Markdown
            </Button>
            <Button size="lg" variant="outline" disabled={!content && !result} onClick={clear}>
              <RotateCcw data-icon="inline-start" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Paste metadata</CardTitle>
            <CardDescription>Input stats for formatting and AI context planning.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Detected format", result?.detectedFormat ?? format],
              ["Lines", result ? result.lineCount.toLocaleString() : content ? content.split(/\r?\n/).length.toLocaleString() : "0"],
              ["Words", result ? result.wordCount.toLocaleString() : "0"],
              ["Characters", result ? result.characterCount.toLocaleString() : "0"],
              ["Token estimate", result ? result.tokenEstimate.toLocaleString() : "0"],
              ["Size", result ? formatBytes(result.fileSize) : formatBytes(new Blob([content]).size)],
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
              <CardTitle>Markdown result</CardTitle>
              <CardDescription>Review, copy, download, or share the generated Markdown.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!result} onClick={copyMarkdown}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={() => download("md")}><Download data-icon="inline-start" /> .md</Button>
              <Button variant="outline" size="sm" disabled={!result} onClick={() => download("txt")}><FileDown data-icon="inline-start" /> TXT</Button>
              <Button variant="outline" size="sm" disabled={!result}><Share2 data-icon="inline-start" /> Share</Button>
              <Button variant="ghost" size="sm" disabled={!result} onClick={clear}><X data-icon="inline-start" /> Clear</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="editor">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="mt-4">
                <Textarea value={preview} readOnly className="min-h-[520px] resize-none font-mono text-sm leading-6" />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="min-h-[520px] overflow-auto rounded-2xl border border-border bg-muted/30 p-5 font-mono text-sm leading-7 whitespace-pre-wrap">{preview}</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
