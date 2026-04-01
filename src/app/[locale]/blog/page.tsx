"use client";

import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BlogCard } from "@/components/cards/BlogCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { blogPosts } from "@/data/blog";

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale();

  const posts = blogPosts.filter((p) => p.locale === locale);

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeader title={t("title")} />

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <BlogCard
                post={post}
                readMoreLabel={t("readMore")}
                readingTimeLabel={t("readingTime", { minutes: post.readingTime })}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
