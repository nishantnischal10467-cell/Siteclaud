import Link from "next/link";
import { AuthForm } from "@/components/site/auth-form";
import { PageShell } from "@/components/site/page-shell";

export default function LoginPage() {
  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-sm text-muted-foreground">New to Siteclaud? <Link className="font-medium text-primary" href="/signup">Create an account</Link></p>
      </section>
    </PageShell>
  );
}
