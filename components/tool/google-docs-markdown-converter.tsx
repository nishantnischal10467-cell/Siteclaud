"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Download, ExternalLink, FileDown, FileText, Loader2, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ConversionResponse } from "@/types/conversion";

async function convertGoogleDocs(url: string) {
  const response = await fetch("/api/convert-google-docs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Google Docs conversion failed.");
  }

  return data as ConversionResponse;
}

export function GoogleDocsMarkdownConverter() {
  const [url, setUrl] = useState("https://docs.google.com/document/d/your-document-id/edit");
  const [result, setResult] = useState<ConversionResponse | null>(null);

  const mutation = useMutation({
    mutationFn: convertGoogleDocs,
    onSuccess: (data) => {
      setResult(data);
      toast.success("Google Doc converted to Markdown.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Google Docs conversion failed."),
  });

  const preview = useMemo(
    () => result?.markdown.slice(0, 2400) ?? "Enter a public Google Docs URL to convert the document into clean Markdown for documentation, archiving, AI context, and migration workflows.",
    [result],
  );

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
    link.download = `${result.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "siteclaud-google-doc-export"}.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setUrl("");
    setResult(null);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> Free AI tool</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">Convert Google Docs to Markdown</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Enter any public Google Docs URL and convert it into clean Markdown for documentation, content migration, archiving, and AI workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://docs.google.com/document/d/.../edit" className="h-12 text-base" />
            <Button size="lg" disabled={!url.trim() || mutation.isPending} onClick={() => mutation.mutate(url)}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <FileText data-icon="inline-start" />}
              Convert to Markdown
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <span>Note: the Google Doc must be publicly accessible to be converted.</span>
            <Button variant="ghost" size="sm" disabled={!url && !result} onClick={reset}><RotateCcw data-icon="inline-start" /> Reset</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Google Docs metadata</CardTitle>
            <CardDescription>Readable stats for exports, prompts, and AI context windows.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Title", result?.title ?? "No conversion yet"],
              ["URL", result?.url ?? (url || "Waiting for public document")],
              ["Words", result ? result.wordCount.toLocaleString() : "0"],
              ["Characters", result ? result.characterCount.toLocaleString() : "0"],
              ["Token estimate", result ? result.tokenEstimate.toLocaleString() : "0"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium">{value}</p>
              </div>
            ))}
            <Button variant="outline" disabled={!result} asChild>
              <a href={result?.url ?? "#"} target="_blank" rel="noreferrer"><ExternalLink data-icon="inline-start" /> Open source</a>
            </Button>
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
                <div className="min-h-[520px] rounded-2xl border border-border bg-muted/30 p-5 font-mono text-sm leading-7 whitespace-pre-wrap">{preview}</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
