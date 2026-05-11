import { DashboardShell } from "@/components/site/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
  ["Siteclaud docs", "2,410", "https://example.com/docs"],
  ["Pricing page", "842", "https://example.com/pricing"],
  ["API reference", "6,120", "https://example.com/api"],
];

export default function HistoryPage() {
  return (
    <DashboardShell>
      <h1 className="text-4xl font-semibold tracking-tight">Conversion history</h1>
      <Card className="mt-8 rounded-2xl border-white/10 bg-white/[0.04] text-white">
        <CardHeader><CardTitle>Recent conversions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Words</TableHead><TableHead>URL</TableHead></TableRow></TableHeader>
            <TableBody>{rows.map((row) => <TableRow key={row[2]}><TableCell>{row[0]}</TableCell><TableCell>{row[1]}</TableCell><TableCell>{row[2]}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
