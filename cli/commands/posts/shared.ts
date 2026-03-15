import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export interface PostMeta {
  dir: string;
  title: string;
  slug: string;
  locale: string;
  created: string;
  updated: string;
  tags: string[];
  hasCover: boolean;
}

export interface PostGroup {
  dir: string;
  date: string;
  slug: string;
  locales: PostMeta[];
}

export const parseFrontmatter = (content: string): Record<string, unknown> => {
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

export const stripFrontmatter = (content: string): string =>
  content.replace(/^---\n[\s\S]*?\n---\n*/, "");

export const loadPosts = async (postsDir: string): Promise<PostGroup[]> => {
  const allDirs = await readdir(postsDir);
  const dirs = allDirs.toSorted().toReversed();
  const groups: PostGroup[] = [];

  for (const dir of dirs) {
    const dirPath = join(postsDir, dir);
    const files = await readdir(dirPath);
    const mdFiles = files.filter((f) => f.endsWith(".md"));

    const dateMatch = dir.match(/^(\d{4}-\d{2}-\d{2})_(.+)$/);
    const date = dateMatch ? dateMatch[1] : "";
    const slug = dateMatch ? dateMatch[2] : dir;
    const hasCover = files.some((f) => f.startsWith("cover."));

    const locales: PostMeta[] = [];

    for (const mdFile of mdFiles) {
      const content = await readFile(join(dirPath, mdFile), "utf8");
      const meta = parseFrontmatter(content);

      locales.push({
        created: (meta.created as string) || "",
        dir,
        hasCover,
        locale: (meta.locale as string) || mdFile.replace(".md", ""),
        slug: (meta.slug as string) || slug,
        tags: (meta.tags as string[]) || [],
        title: (meta.title as string) || slug,
        updated: (meta.updated as string) || "",
      });
    }

    if (locales.length > 0) {
      groups.push({ date, dir, locales, slug });
    }
  }

  return groups;
};
