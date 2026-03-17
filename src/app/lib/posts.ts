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

export interface PostAlternate {
  locale: Post["locale"];
  slug: string;
}

const postsBySlug = new Map<string, Post>();
const alternatesBySlug = new Map<string, PostAlternate[]>();
const dirToSlugs = new Map<string, PostAlternate[]>();

for (const [path, raw] of Object.entries(modules)) {
  const { data, content } = matter(raw);
  const slug = data.slug as string | undefined;
  if (!slug) {
    continue;
  }

  const dir = path.slice(0, path.lastIndexOf("/") + 1);
  const coverKey = Object.keys(coverImages).find((key) => key.startsWith(dir));
  const locale: Post["locale"] = data.locale === "pt-BR" ? "pt-BR" : "en-US";

  postsBySlug.set(slug, {
    body: content,
    cover: coverKey ? coverImages[coverKey] : "",
    created: String(data.created ?? ""),
    description: makeExcerpt(stripMarkdown(content)),
    locale,
    slug,
    tags: (data.tags as string[]) || [],
    title: (data.title as string) || slug,
    updated: String(data.updated ?? ""),
  });

  const group = dirToSlugs.get(dir) ?? [];
  group.push({ locale, slug });
  dirToSlugs.set(dir, group);
}

for (const group of dirToSlugs.values()) {
  if (group.length < 2) {
    continue;
  }
  for (const { slug } of group) {
    alternatesBySlug.set(
      slug,
      group.filter((alt) => alt.slug !== slug)
    );
  }
}

export const getPostBySlug = (slug: string): Post | undefined =>
  postsBySlug.get(slug);

export const getPostAlternates = (slug: string): PostAlternate[] =>
  alternatesBySlug.get(slug) ?? [];

export const getAllPosts = (): Post[] => [...postsBySlug.values()];

const POSTS_PER_PAGE = 10;

const sortedPosts = getAllPosts().toSorted(
  (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
);

export interface PaginatedPosts {
  posts: Post[];
  page: number;
  totalPages: number;
}

export const getPaginatedPosts = (
  page: number,
  locale?: Post["locale"]
): PaginatedPosts | undefined => {
  const filtered = locale
    ? sortedPosts.filter((p) => p.locale === locale)
    : sortedPosts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  if (page < 1 || page > totalPages) {
    return undefined;
  }
  const start = (page - 1) * POSTS_PER_PAGE;
  return {
    page,
    posts: filtered.slice(start, start + POSTS_PER_PAGE),
    totalPages,
  };
};

export const getPostsByTag = (
  tag: string,
  page: number,
  locale?: Post["locale"]
): PaginatedPosts | undefined => {
  const filtered = sortedPosts.filter(
    (p) =>
      p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()) &&
      (!locale || p.locale === locale)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  if (page < 1 || page > totalPages || filtered.length === 0) {
    return undefined;
  }
  const start = (page - 1) * POSTS_PER_PAGE;
  return {
    page,
    posts: filtered.slice(start, start + POSTS_PER_PAGE),
    totalPages,
  };
};

export const serializePost = (post: Post): string => {
  const frontmatter = [
    "---",
    `title: ${post.title}`,
    `slug: ${post.slug}`,
    `locale: ${post.locale}`,
    `created: ${new Date(post.created).toISOString()}`,
    `updated: ${new Date(post.updated).toISOString()}`,
    ...(post.tags.length > 0
      ? ["tags:", ...post.tags.map((tag) => `  - ${tag}`)]
      : []),
    "---",
  ].join("\n");

  return `${frontmatter}\n${post.body}`;
};
