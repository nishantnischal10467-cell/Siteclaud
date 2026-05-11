import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/site/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://siteclaud.com"),
  title: {
    default: "Siteclaud - AI-ready website knowledge systems",
    template: "%s | Siteclaud",
  },
  description:
    "Convert websites into clean Markdown, train AI workflows, extract structured content, and automate documentation pipelines.",
  keywords: ["webpage to markdown", "AI knowledge base", "website extraction", "markdown API"],
  openGraph: {
    title: "Siteclaud - AI-ready website knowledge systems",
    description:
      "A premium SaaS platform for converting web content into AI-ready Markdown and structured knowledge.",
    url: "https://siteclaud.com",
    siteName: "Siteclaud",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
