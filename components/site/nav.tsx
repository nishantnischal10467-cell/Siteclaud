"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/features", label: "Features" },
  { href: "/tools", label: "Tools" },
  { href: "/#integrations", label: "Integrations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-blue-500/20">
        <Sparkles />
      </span>
      <span className="text-lg">Siteclaud</span>
    </Link>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/78 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                pathname === link.href && "bg-muted text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Start Free Trial</Link>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open ? (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 text-sm font-medium" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
