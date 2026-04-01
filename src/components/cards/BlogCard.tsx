import { Link } from "@/i18n/navigation";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: number;
  image?: string;
}

interface BlogCardProps {
  post: BlogPost;
  readMoreLabel: string;
  readingTimeLabel: string;
}

export function BlogCard({ post, readMoreLabel, readingTimeLabel }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
    >
      {/* Image */}
      <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
        {post.title}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span>&middot;</span>
          <span>{readingTimeLabel}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-primary">
          {readMoreLabel} &rarr;
        </span>
      </div>
    </Link>
  );
}
