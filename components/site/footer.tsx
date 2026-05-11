import Link from "next/link";
import { Code2, MessageCircle, Network } from "lucide-react";
import { Logo } from "@/components/site/nav";

const groups = [
  { title: "Tools", links: ["Convert Webpage to Markdown", "Convert PDF to Markdown", "AI Cleanup", "Markdown Beautifier"] },
  { title: "Features", links: ["Chatbot Training", "Lead Capture", "Email Summaries", "Human Escalation"] },
  { title: "Product", links: ["Pricing", "Dashboard", "Integrations", "Changelog"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Contact"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-slate-950 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="max-w-sm text-sm leading-6 text-slate-300">
            Siteclaud turns messy websites into structured Markdown, API-ready datasets, and support workflows your AI systems can trust.
          </p>
          <div className="flex gap-2 text-slate-300">
            <Link href="#" aria-label="Social feed" className="rounded-lg border border-white/10 p-2 hover:bg-white/10"><MessageCircle /></Link>
            <Link href="#" aria-label="Developer repository" className="rounded-lg border border-white/10 p-2 hover:bg-white/10"><Code2 /></Link>
            <Link href="#" aria-label="Professional network" className="rounded-lg border border-white/10 p-2 hover:bg-white/10"><Network /></Link>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              {group.links.map((item) => (
                <Link key={item} href="#" className="text-sm text-slate-300 transition hover:text-white">
                  {item}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-sm text-slate-400">
        © 2026 Siteclaud. Built for AI-ready knowledge operations.
      </div>
    </footer>
  );
}
