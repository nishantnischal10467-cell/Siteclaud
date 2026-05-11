import { PageShell } from "@/components/site/page-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const posts = ["How to prepare website content for LLMs", "Markdown vs HTML for retrieval pipelines", "Designing rate limits for extraction APIs"];

export default function BlogPage() {
  return (
    <PageShell>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-semibold tracking-tight">Siteclaud Blog</h1>
          <div className="mt-10 grid gap-5">
            {posts.map((post) => (
              <Card key={post} className="rounded-2xl">
                <CardHeader><CardTitle>{post}</CardTitle><CardDescription>Guides for teams building AI-ready support and documentation systems.</CardDescription></CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
