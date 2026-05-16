"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Copy, Download, FileDown, FileText, Loader2, RotateCcw, Share2, Sparkles, UploadCloud, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { DocxConversionResponse } from "@/types/conversion";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

async function convertDocx(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/convert-docx", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "DOCX conversion failed.");
  }

  return data as DocxConversionResponse;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function DocxMarkdownConverter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<DocxConversionResponse | null>(null);

  const mutation = useMutation({
    mutationFn: convertDocx,
    onSuccess: (data) => {
      setResult(data);
      toast.success("DOCX converted to Markdown.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "DOCX conversion failed."),
  });

  const preview = useMemo(
    () => result?.markdown.slice(0, 2400) ?? "Upload a DOCX file to convert headings, lists, links, tables, bold text, and document structure into clean Markdown.",
    [result],
  );

  function selectFile(nextFile?: File) {
    if (!nextFile) return;

    if (nextFile.type !== DOCX_MIME && !nextFile.name.toLowerCase().endsWith(".docx")) {
      toast.error("Please choose a DOCX file.");
      return;
    }

    if (nextFile.size > 15 * 1024 * 1024) {
      toast.error("DOCX must be 15MB or smaller.");
      return;
    }

    setFile(nextFile);
    setResult(null);
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
    link.download = `${result.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "siteclaud-docx-export"}.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="grid gap-8">
      <Card className="glass-panel rounded-3xl">
        <CardHeader className="gap-3 text-center">
          <Badge className="mx-auto gap-2" variant="secondary"><Sparkles /> Free AI tool</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">Convert DOCX to Markdown</h1>
          <CardDescription className="mx-auto max-w-2xl text-base leading-7">
            Upload a Word document and convert it into clean Markdown for AI systems, docs, knowledge bases, and publishing workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              selectFile(event.dataTransfer.files[0]);
            }}
            className={cn(
              "grid min-h-[240px] place-items-center rounded-3xl border border-dashed border-border bg-background/70 p-8 text-center transition hover:border-primary hover:bg-blue-50/50 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]",
              dragging && "border-primary bg-blue-50 dark:bg-blue-950/20",
            )}
          >
            <div className="flex max-w-md flex-col items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                {file ? <CheckCircle2 /> : <UploadCloud />}
              </span>
              <div>
                <p className="text-lg font-semibold">{file ? file.name : "Upload or drag & drop your DOCX"}</p>
                <p className="mt-2 text-sm text-muted-foreground">Supports modern Word documents up to 15MB. Legacy .doc files should be saved as .docx first.</p>
              </div>
              {file ? <Badge variant="secondary">{formatBytes(file.size)}</Badge> : null}
            </div>
          </button>
          <input ref={inputRef} type="file" accept={`${DOCX_MIME},.docx`} className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled={!file || mutation.isPending} onClick={() => file && mutation.mutate(file)}>
              {mutation.isPending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <FileText data-icon="inline-start" />}
              Convert DOCX
            </Button>
            <Button size="lg" variant="outline" disabled={!file && !result} onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>DOCX metadata</CardTitle>
            <CardDescription>Document stats for AI context planning and exports.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              ["File", result?.fileName ?? file?.name ?? "No DOCX selected"],
              ["Title", result?.title ?? "Waiting for conversion"],
              ["Parser notes", result ? result.messageCount.toLocaleString() : "0"],
              ["Words", result ? result.wordCount.toLocaleString() : "0"],
              ["Characters", result ? result.characterCount.toLocaleString() : "0"],
              ["Token estimate", result ? result.tokenEstimate.toLocaleString() : "0"],
              ["Size", result ? formatBytes(result.fileSize) : file ? formatBytes(file.size) : "0 B"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium">{value}</p>
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
