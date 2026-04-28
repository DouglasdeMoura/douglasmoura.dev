import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export interface BookMeta {
  dir: string;
  title: string;
  slug: string;
  locale: string;
  created: string;
  updated: string;
  tags: string[];
  status: "draft" | "beta" | "published";
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

export const loadBooks = async (booksDir: string): Promise<BookMeta[]> => {
  const allDirs = await readdir(booksDir);
  const dirs = allDirs.toSorted();
  const books: BookMeta[] = [];

  for (const dir of dirs) {
    const metaPath = join(booksDir, dir, "meta.md");
    let content = "";
    try {
      content = await readFile(metaPath, "utf8");
    } catch {
      continue;
    }

    const meta = parseFrontmatter(content);
    books.push({
      created: (meta.created as string) || "",
      dir,
      locale: (meta.locale as string) || "en-US",
      slug: (meta.slug as string) || dir,
      status:
        meta.status === "beta" || meta.status === "published"
          ? meta.status
          : "draft",
      tags: (meta.tags as string[]) || [],
      title: (meta.title as string) || dir,
      updated: (meta.updated as string) || "",
    });
  }

  return books.toSorted(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );
};
