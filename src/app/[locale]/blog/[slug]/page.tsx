import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { blogPosts } from "@/data/blog";
import { createMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = blogPosts.find((p) => p.slug === slug && p.locale === locale);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    locale,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = blogPosts.find((p) => p.slug === slug && p.locale === locale);

  if (!post) notFound();

  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-3xl">
        <CTAButton href="/blog" variant="outline" className="mb-8 text-sm px-4 py-2">
          &larr; {locale === "es" ? "Volver al blog" : "Back to blog"}
        </CTAButton>

        {/* Hero Image */}
        <div className="aspect-video overflow-hidden rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-lg">
          {post.title}
        </div>

        {/* Meta */}
        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span>&middot;</span>
          <span>
            {post.readingTime} {locale === "es" ? "min de lectura" : "min read"}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Content */}
        <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">{post.excerpt}</p>
          <p className="text-muted-foreground">
            {locale === "es"
              ? "Contenido completo próximamente. Este es un artículo de ejemplo."
              : "Full content coming soon. This is a sample article."}
          </p>
        </div>
      </Container>
    </section>
  );
}
