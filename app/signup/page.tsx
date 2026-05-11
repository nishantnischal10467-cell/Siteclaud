import Link from "next/link";
import { AuthForm } from "@/components/site/auth-form";
import { PageShell } from "@/components/site/page-shell";

export default function SignupPage() {
  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <AuthForm mode="signup" />
        <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link className="font-medium text-primary" href="/login">Sign in</Link></p>
      </section>
    </PageShell>
  );
}
