"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  CircleDot,
  CloudLightning,
  Database,
  FileText,
  LifeBuoy,
  Mail,
  MessageSquare,
  Play,
  PlugZap,
  Search,
  Sparkles,
  Star,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";
import { cn } from "@/lib/utils";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const companies = ["OpenAI", "Notion", "Vercel", "Supabase", "Linear", "Zapier"];
const integrations = ["Slack", "Discord", "Notion", "Zapier", "Intercom", "WhatsApp", "Zendesk", "HubSpot"];

const features = [
  { icon: Bot, title: "AI-trained chatbot", body: "Train support agents on fresh, structured website knowledge without brittle copy-paste workflows." },
  { icon: Zap, title: "Quick prompts", body: "Generate summaries, FAQs, doc outlines, and extraction recipes from the same Markdown source." },
  { icon: Mail, title: "Email summaries", body: "Send conversion briefs, crawler findings, and weekly knowledge drift reports to your team." },
  { icon: LifeBuoy, title: "Human escalation", body: "Route uncertain answers and lead-heavy conversations to people with the original source attached." },
  { icon: Users, title: "Lead generation", body: "Capture intent, enrich accounts, and sync high-signal website interactions into your CRM." },
  { icon: PlugZap, title: "API integrations", body: "Use clean endpoints, API keys, and exports to connect Siteclaud with your internal stack." },
];

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <Badge variant="secondary" className="mb-4">{eyebrow}</Badge>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{body}</p>
    </div>
  );
}

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative"
    >
      <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-indigo-500/20 blur-3xl" />
      <div className="glass-panel relative overflow-hidden rounded-3xl p-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-2xl dark:border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CircleDot className="text-blue-300" />
              crawl.siteclaud.ai
            </div>
            <Badge variant="secondary">Live run</Badge>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                <FileText /> Markdown Preview
              </div>
              <pre className="overflow-hidden text-xs leading-6 text-blue-50">
{`# Pricing documentation

Siteclaud converts dynamic pages into
AI-ready Markdown with source links.

## Plan limits
- 1,000 conversions / month
- API access
- Team history

[View plans](/pricing)`}
              </pre>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-white p-4 text-slate-950">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium"><MessageSquare /> AI assistant</div>
                <div className="flex flex-col gap-2 text-xs">
                  <p className="rounded-xl bg-slate-100 p-3">What changed on the pricing page?</p>
                  <p className="rounded-xl bg-blue-600 p-3 text-white">Three limits changed and one CTA was added. I attached clean Markdown.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["98%", "12.4k"].map((item, index) => (
                  <div key={item} className="rounded-2xl bg-white/[0.06] p-4">
                    <p className="text-2xl font-semibold">{item}</p>
                    <p className="text-xs text-slate-400">{index === 0 ? "Readable score" : "Tokens saved"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteNav />
      <main>
        <section className="blueprint-grid relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.18),transparent_58%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
            <motion.div initial="hidden" animate="show" variants={fade} transition={{ duration: 0.6 }} className="flex flex-col items-start gap-7">
              <Badge variant="secondary" className="gap-2"><Sparkles /> AI content infrastructure</Badge>
              <div className="flex flex-col gap-5">
                <h1 className="text-balance text-5xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-7xl">
                  Turn your website into an AI-ready knowledge system
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Convert websites into clean Markdown, train AI chatbots, extract structured content, and automate documentation workflows.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                {["AI-powered extraction", "Clean Markdown conversion", "Developer friendly", "API access", "Works with dynamic websites"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><Check className="text-blue-600" /> {item}</div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild><Link href="/signup">Start Free Trial <ArrowRight data-icon="inline-end" /></Link></Button>
                <Button size="lg" variant="outline" asChild><Link href="/tools/convert-webpage-to-markdown"><Play data-icon="inline-start" /> Try Demo</Link></Button>
              </div>
            </motion.div>
            <HeroMockup />
          </div>
        </section>

        <section className="border-y border-border bg-white/60 px-4 py-8 dark:bg-white/[0.03] sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold text-muted-foreground">
            {companies.map((company) => <span key={company}>{company}</span>)}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Before and after" title="From web clutter to dependable AI context" body="Generic crawlers capture too much noise. Siteclaud focuses on readable, structured, source-aware output." />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            {[
              ["Problems with generic AI tools", ["Navigation noise", "Cookie banners in answers", "Broken dynamic pages", "No history or API governance"]],
              ["Benefits of Siteclaud", ["Readable Markdown", "Token-aware output", "Dashboard and audit trail", "API keys, exports, and rate limits"]],
            ].map(([title, items], index) => (
              <Card key={title as string} className={cn("rounded-2xl transition hover:-translate-y-1 hover:shadow-xl", index === 1 && "border-blue-200 bg-blue-50/60 dark:border-blue-500/30 dark:bg-blue-950/20")}>
                <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {(items as string[]).map((item) => <div key={item} className="flex items-center gap-3"><Check className="text-blue-600" /> {item}</div>)}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Workflow" title="You’re three simple steps away from AI-powered workflows" body="Add a URL, let Siteclaud structure the content, then send it anywhere your team works." />
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {["Add your website URL", "Convert & structure content", "Use with AI systems"].map((step, index) => (
              <Card key={step} className="rounded-2xl border-white/10 bg-white/[0.04] text-white">
                <CardHeader>
                  <div className="mb-5 text-6xl font-semibold text-blue-300">0{index + 1}</div>
                  <CardTitle>{step}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300">Automated defaults with enough control for developers and ops teams.</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Features" title="Built for support, content, and engineering teams" body="Every feature is designed to keep your AI knowledge clean, current, and useful." />
          <div className="mx-auto grid max-w-7xl gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                className={cn("grid items-center gap-8 rounded-3xl border border-border bg-white/70 p-6 shadow-sm dark:bg-white/[0.03] lg:grid-cols-2", index % 2 && "lg:[&>*:first-child]:order-2")}
              >
                <div className="flex flex-col gap-4">
                  <feature.icon className="text-blue-600" />
                  <h3 className="text-3xl font-semibold tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.body}</p>
                </div>
                <div className="rounded-2xl border border-border bg-slate-950 p-5 text-white">
                  <div className="mb-4 flex items-center justify-between text-sm text-slate-300"><span>siteclaud/{feature.title.toLowerCase().replaceAll(" ", "-")}</span><Badge variant="secondary">Active</Badge></div>
                  <div className="grid gap-3">
                    <div className="h-3 rounded-full bg-blue-400/80" />
                    <div className="h-3 w-4/5 rounded-full bg-white/20" />
                    <div className="h-3 w-2/3 rounded-full bg-white/20" />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[Search, Database, Workflow].map((Icon, i) => <div key={i} className="grid aspect-square place-items-center rounded-2xl bg-white/[0.07]"><Icon /></div>)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="integrations" className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Integrations" title="Connect knowledge to the tools your team already trusts" body="Orbit Siteclaud around support, docs, chat, and automation platforms." />
          <div className="mx-auto grid max-w-4xl place-items-center">
            <div className="relative grid size-[320px] place-items-center rounded-full border border-border bg-white/60 shadow-inner dark:bg-white/[0.03] sm:size-[520px]">
              <div className="grid size-28 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-2xl shadow-blue-500/30"><CloudLightning /></div>
              {integrations.map((item, index) => {
                const angle = (index / integrations.length) * Math.PI * 2;
                const radius = 210;
                return (
                  <div
                    key={item}
                    className="absolute rounded-2xl border border-border bg-background px-3 py-2 text-xs font-semibold shadow-sm sm:text-sm"
                    style={{ transform: `translate(${Math.cos(angle) * radius * 0.8}px, ${Math.sin(angle) * radius * 0.8}px)` }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white/70 px-4 py-20 dark:bg-white/[0.03] sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Live demo" title="Watch Siteclaud answer with structured context" body="A compact support conversation powered by extracted Markdown, metadata, and source links." />
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-background p-5 shadow-xl">
            {["Can you summarize our API docs?", "Yes. I found authentication, rate limits, and export endpoints. The Markdown is attached with source headings.", "Send this to the docs team."].map((msg, index) => (
              <div key={msg} className={cn("mb-3 max-w-[82%] rounded-2xl p-4 text-sm", index === 1 ? "ml-auto bg-blue-600 text-white" : "bg-muted")}>{msg}</div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Customers" title="Teams use Siteclaud to keep AI grounded" body="A few words from operators building cleaner knowledge workflows." />
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {["Maya Chen", "Elliot Park", "Sara Gomez"].map((name, index) => (
              <Card key={name} className="rounded-2xl">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Avatar><AvatarFallback>{name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                  <div><CardTitle className="text-base">{name}</CardTitle><CardDescription>{["Notiondesk", "Shipframe", "Northstar AI"][index]}</CardDescription></div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex text-blue-600">{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div>
                  <p className="text-sm text-muted-foreground">“Siteclaud gave our AI stack clean source material in a day. The dashboard made adoption easy for support and engineering.”</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow="FAQ" title="Questions before you convert?" body="The essentials for teams evaluating Siteclaud." />
            <Accordion className="rounded-2xl border border-border bg-background px-4">
              {[
                ["Does Siteclaud work with dynamic websites?", "Yes. The converter uses Puppeteer for rendered pages and falls back to direct fetch when needed."],
                ["Can I use the API?", "Yes. API key generation, rate limiting, and history endpoints are included in the architecture."],
                ["Is this ready for subscriptions?", "The subscription model and pricing UI are included, with Stripe integration points documented for deployment."],
              ].map(([q, a]) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-10 text-center text-white shadow-2xl shadow-blue-500/20">
            <h2 className="text-4xl font-semibold tracking-tight">Ready to build AI-ready workflows?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-50">Start with a single webpage, then scale into a governed knowledge pipeline.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" size="lg" asChild><Link href="/signup">Start Free Trial</Link></Button>
              <Button variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10" asChild><Link href="/pricing">Book Demo</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
