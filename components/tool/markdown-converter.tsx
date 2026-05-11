"use client";

import { useMutation } from "@tanstack/react-query";
import { Copy, Download, ExternalLink, FileDown, FileText, Loader2, Moon, Share2, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useConversionStore } from "@/hooks/use-conversion-store";
import type { ConversionResponse } from "@/types/conversion";

async function convert(url: string) {
  const response = await fetch("/api/convert", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url, aiCleanup: true, beautify: true }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Conversion failed.");
  }

  return data as ConversionResponse;
}

export function MarkdownConverter() {
  const [url, setUrl] = useState("https://sitegpt.ai/tools/convert-webpage-to-markdown");
  const [cleanup, setCleanup] = useState(true);
  const { latest, setLatest } = useConversionStore();
  const { theme, setTheme } = useTheme();

  const mutation = useMutation({
    mutationFn: convert,
    onSuccess: (data) => {
      setLatest(data);
      toast.success("Markdown conversion complete.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Conversion failed."),
  });

  const preview = useMemo(() => latest?.markdown.slice(0, 1800) ?? "Your converted Markdown will appear here with headings, links, images, lists, tables, and code blocks preserved.", [latest]);

  function copyMarkdown() {
    if (!latest) return;
    navigator.clipboard.writeText(latest.markdown);
    toast.success("Copied Markdown to clipboard.");
  }

  function download(ext: "md" | "txt") {
    if (!latest) return;
    const blob = new Blob([latest.markdown], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${latest.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "siteclaud-export"}.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> Free AI tool</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">Convert Webpage to Markdown</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Enter any webpage URL and instantly convert it into clean Markdown for AI systems, documentation, and content workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/docs" className="h-12 text-base" />
            <Button size="lg" disabled={mutation.isPending} onClick={() => mutation.mutate(url)}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <FileText data-icon="inline-start" />}
              Convert
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <label className="flex items-center gap-2"><Switch checked={cleanup} onCheckedChange={setCleanup} /> AI cleanup mode</label>
            <span>Markdown beautifier</span>
            <span>TXT/PDF export-ready</span>
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />} Theme
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Webpage metadata</CardTitle>
            <CardDescription>Readable extraction stats for AI context planning.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["Title", latest?.title ?? "No conversion yet"],
              ["URL", latest?.url ?? "Waiting for webpage"],
              ["Words", latest ? latest.wordCount.toLocaleString() : "0"],
              ["Characters", latest ? latest.characterCount.toLocaleString() : "0"],
              ["Token estimate", latest ? latest.tokenEstimate.toLocaleString() : "0"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium">{value}</p>
              </div>
            ))}
            <Button variant="outline" disabled={!latest} asChild>
              <a href={latest?.url ?? "#"} target="_blank" rel="noreferrer"><ExternalLink data-icon="inline-start" /> Open source</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Markdown result</CardTitle>
              <CardDescription>Copy, download, preview, or share the conversion.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={!latest} onClick={copyMarkdown}><Copy data-icon="inline-start" /> Copy</Button>
              <Button variant="outline" size="sm" disabled={!latest} onClick={() => download("md")}><Download data-icon="inline-start" /> .md</Button>
              <Button variant="outline" size="sm" disabled={!latest} onClick={() => download("txt")}><FileDown data-icon="inline-start" /> TXT</Button>
              <Button variant="outline" size="sm" disabled={!latest}><Share2 data-icon="inline-start" /> Share</Button>
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
