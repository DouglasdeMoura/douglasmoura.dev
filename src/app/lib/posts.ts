import matter from "gray-matter";

const modules = import.meta.glob("/content/posts/**/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export interface Post {
  title: string;
  slug: string;
  locale: "en-US" | "pt-BR";
  created: string;
  updated: string;
  tags: string[];
  body: string;
}

const postsBySlug = new Map<string, Post>();

for (const raw of Object.values(modules)) {
  const { data, content } = matter(raw);
  const slug = data.slug as string | undefined;
  if (!slug) {
    continue;
  }

  postsBySlug.set(slug, {
    body: content,
    created: String(data.created ?? ""),
    locale: data.locale === "pt-BR" ? "pt-BR" : "en-US",
    slug,
    tags: (data.tags as string[]) || [],
    title: (data.title as string) || slug,
    updated: String(data.updated ?? ""),
  });
}

export const getPostBySlug = (slug: string): Post | undefined =>
  postsBySlug.get(slug);

export const getAllPosts = (): Post[] => [...postsBySlug.values()];
