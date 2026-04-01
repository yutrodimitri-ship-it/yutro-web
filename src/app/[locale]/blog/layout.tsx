import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Noticias, tendencias y artículos sobre IA generativa, producción audiovisual y creatividad digital.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
