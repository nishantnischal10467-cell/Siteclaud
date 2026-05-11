import { Activity, Database, KeyRound, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DashboardShell } from "@/components/site/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats: Array<[string, string, LucideIcon]> = [
  ["Total conversions", "1,284", Database],
  ["API usage", "42.8k", KeyRound],
  ["Subscription", "Growth", TrendingUp],
  ["Recent activity", "18 today", Activity],
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <Card key={label as string} className="rounded-2xl border-white/10 bg-white/[0.04] text-white">
            <CardHeader><Icon className="text-blue-300" /><CardTitle className="text-sm text-slate-300">{label}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold">{value}</p></CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6 rounded-2xl border-white/10 bg-white/[0.04] text-white">
        <CardHeader><CardTitle>Usage analytics</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <Progress value={68} />
          <p className="text-sm text-slate-300">68% of monthly conversion quota used. API traffic is up 18% week over week.</p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
