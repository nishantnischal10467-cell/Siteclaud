import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";

const plans = [
  ["Free", "$0", "100 conversions", "Community support", "Markdown exports"],
  ["Growth", "$29", "5,000 conversions", "API access", "Conversion history"],
  ["Scale", "$149", "Unlimited projects", "SAML-ready architecture", "Priority support"],
];

export default function PricingPage() {
  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-semibold tracking-tight">Pricing that scales with your knowledge system</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Start free, add API throughput when your workflows grow, and connect Stripe when you deploy.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map(([name, price, ...features]) => (
              <Card key={name} className="rounded-2xl text-left">
                <CardHeader><CardTitle>{name}</CardTitle><p className="text-4xl font-semibold">{price}<span className="text-base text-muted-foreground">/mo</span></p></CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {features.map((feature) => <p key={feature} className="flex items-center gap-2 text-sm"><Check className="text-blue-600" /> {feature}</p>)}
                  <Button asChild><Link href="/signup">Start {name}</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
