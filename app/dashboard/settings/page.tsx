import { DashboardShell } from "@/components/site/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <h1 className="text-4xl font-semibold tracking-tight">Settings</h1>
      <Card className="mt-8 rounded-2xl border-white/10 bg-white/[0.04] text-white">
        <CardHeader><CardTitle>Workspace settings</CardTitle></CardHeader>
        <CardContent className="grid max-w-xl gap-5">
          <div className="flex flex-col gap-2"><Label htmlFor="workspace">Workspace name</Label><Input id="workspace" defaultValue="Siteclaud Team" /></div>
          <label className="flex items-center gap-3 text-sm"><Switch defaultChecked /> Enable weekly email summaries</label>
          <label className="flex items-center gap-3 text-sm"><Switch defaultChecked /> AI cleanup mode by default</label>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
