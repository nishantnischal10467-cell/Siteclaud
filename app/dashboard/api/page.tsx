import { KeyRound } from "lucide-react";
import { DashboardShell } from "@/components/site/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiPage() {
  return (
    <DashboardShell>
      <h1 className="text-4xl font-semibold tracking-tight">API access</h1>
      <Card className="mt-8 rounded-2xl border-white/10 bg-white/[0.04] text-white">
        <CardHeader><KeyRound className="text-blue-300" /><CardTitle>Developer keys</CardTitle><CardDescription>Create API keys for server-side conversion workflows.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <pre className="rounded-2xl bg-black/40 p-4 text-sm text-blue-100">POST /api/convert {"{ url: 'https://example.com' }"}</pre>
          <Button className="w-fit">Create API key</Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
