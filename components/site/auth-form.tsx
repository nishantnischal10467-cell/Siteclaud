"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(data.error ?? "Authentication failed.");
      return;
    }

    toast.success(mode === "login" ? "Welcome back." : "Account created.");
    router.push("/dashboard");
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-3xl">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Sign in" : "Create your account"}</CardTitle>
        <CardDescription>{mode === "login" ? "Access your conversion history and API keys." : "Start your free Siteclaud trial."}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {mode === "signup" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Ada Lovelace" />
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@company.com" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" minLength={8} required />
          </div>
          <Button disabled={pending} size="lg">
            {pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
            {mode === "login" ? "Sign in" : "Start Free Trial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
