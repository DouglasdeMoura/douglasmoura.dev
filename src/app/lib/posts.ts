import matter from "gray-matter";

const modules = import.meta.glob("/content/posts/**/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const coverImages = import.meta.glob(
  "/content/posts/**/cover.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: "?url" }
) as Record<string, string>;

export interface Post {
  title: string;
  slug: string;
  locale: "en-US" | "pt-BR";
  created: string;
  updated: string;
  tags: string[];
  body: string;
  cover: string;
  description: string;
}

const stripMarkdown = (md: string): string =>
  md
    .replaceAll(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replaceAll(/\[[^\]]*\]\([^)]*\)/g, (match) =>
      match.replaceAll(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    )
    .replaceAll(/^#{1,6}\s+/gm, "")
    .replaceAll(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    .replaceAll(/`{1,3}[^`]*`{1,3}/g, "")
    .replaceAll(/```[\s\S]*?```/g, "")
    .replaceAll(/<[^>]+>/g, "")
    .replaceAll(/\n+/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();

const makeExcerpt = (text: string, maxLength = 155): string => {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
};

const postsBySlug = new Map<string, Post>();

for (const [path, raw] of Object.entries(modules)) {
  const { data, content } = matter(raw);
  const slug = data.slug as string | undefined;
  if (!slug) {
    continue;
  }

  const dir = path.slice(0, path.lastIndexOf("/") + 1);
  const coverKey = Object.keys(coverImages).find((key) => key.startsWith(dir));

  postsBySlug.set(slug, {
    body: content,
    cover: coverKey ? coverImages[coverKey] : "",
    created: String(data.created ?? ""),
    description: makeExcerpt(stripMarkdown(content)),
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
