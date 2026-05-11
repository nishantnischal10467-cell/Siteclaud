import Link from "next/link";
import { BarChart3, Clock, KeyRound, Settings, Sparkles } from "lucide-react";

const items = [
  ["/dashboard", "Overview", BarChart3],
  ["/dashboard/history", "History", Clock],
  ["/dashboard/api", "API", KeyRound],
  ["/dashboard/settings", "Settings", Settings],
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-white/[0.03] p-5 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-2 font-semibold"><span className="grid size-9 place-items-center rounded-xl bg-blue-600"><Sparkles /></span> Siteclaud</Link>
        <nav className="flex flex-col gap-2">
          {items.map(([href, label, Icon]) => (
            <Link key={href as string} href={href as string} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
              <Icon /> {label as string}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-4 lg:ml-64 lg:p-8">{children}</main>
    </div>
  );
}
