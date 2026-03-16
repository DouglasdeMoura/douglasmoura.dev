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

const parseFrontmatter = (content: string): Record<string, unknown> => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  const meta: Record<string, unknown> = {};
  const lines = match[1].split("\n");
  let currentArray: string[] | null = null;
  let currentKey = "";

  for (const line of lines) {
    const arrayItem = line.match(/^\s+-\s+(.+)/);
    if (arrayItem && currentArray) {
      currentArray.push(arrayItem[1].replaceAll(/^["']|["']$/g, ""));
      continue;
    }

    currentArray = null;
    const kv = line.match(/^(\w+):\s*(.*)/);
    if (kv) {
      const [, key, value] = kv;
      if (value.trim()) {
        meta[key] = value.replaceAll(/^["']|["']$/g, "");
      } else {
        currentArray = [];
        currentKey = key;
        meta[currentKey] = currentArray;
      }
    }
  }

  return meta;
};

const stripFrontmatter = (content: string): string =>
  content.replace(/^---\n[\s\S]*?\n---\n*/, "");

const postsBySlug = new Map<string, Post>();

for (const raw of Object.values(modules)) {
  const meta = parseFrontmatter(raw);
  const slug = meta.slug as string | undefined;
  if (!slug) {
    continue;
  }

  postsBySlug.set(slug, {
    body: stripFrontmatter(raw),
    created: (meta.created as string) || "",
    locale: meta.locale === "pt-BR" ? "pt-BR" : "en-US",
    slug,
    tags: (meta.tags as string[]) || [],
    title: (meta.title as string) || slug,
    updated: (meta.updated as string) || "",
  });
}

export const getPostBySlug = (slug: string): Post | undefined =>
  postsBySlug.get(slug);

export const getAllPosts = (): Post[] => [...postsBySlug.values()];
