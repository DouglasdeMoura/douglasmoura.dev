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

interface BookMetaFile {
  slug?: string;
  status?: "draft" | "beta" | "published";
  tags?: string[];
  locales?: Record<
    string,
    {
      title?: string;
      created?: string;
      updated?: string;
    }
  >;
}

export const loadBooks = async (booksDir: string): Promise<BookMeta[]> => {
  const allDirs = await readdir(booksDir);
  const dirs = allDirs.toSorted();
  const books: BookMeta[] = [];

  for (const dir of dirs) {
    const metaPath = join(booksDir, dir, "meta.json");
    let content: string;
    try {
      content = await readFile(metaPath, "utf8");
    } catch {
      continue;
    }

    let meta: BookMetaFile;
    try {
      meta = JSON.parse(content) as BookMetaFile;
    } catch {
      continue;
    }

    for (const [locale, localeMeta] of Object.entries(meta.locales ?? {})) {
      books.push({
        created: localeMeta.created ?? "",
        dir,
        locale,
        slug: meta.slug || dir,
        status:
          meta.status === "beta" || meta.status === "published"
            ? meta.status
            : "draft",
        tags: meta.tags ?? [],
        title: localeMeta.title ?? dir,
        updated: localeMeta.updated ?? localeMeta.created ?? "",
      });
    }
  }

  return books.toSorted(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );
};
