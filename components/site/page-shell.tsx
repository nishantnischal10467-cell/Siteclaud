import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
