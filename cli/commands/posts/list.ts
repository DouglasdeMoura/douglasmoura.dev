import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { defineCommand } from "citty";
import { consola } from "consola";

interface PostMeta {
  dir: string;
  title: string;
  slug: string;
  locale: string;
  created: string;
  updated: string;
  tags: string[];
  hasCover: boolean;
}

interface PostGroup {
  dir: string;
  date: string;
  slug: string;
  locales: PostMeta[];
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

const loadPosts = async (postsDir: string): Promise<PostGroup[]> => {
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

const dim = (text: string): string => `\u001B[2m${text}\u001B[0m`;
const bold = (text: string): string => `\u001B[1m${text}\u001B[0m`;
const cyan = (text: string): string => `\u001B[36m${text}\u001B[0m`;
const green = (text: string): string => `\u001B[32m${text}\u001B[0m`;
const yellow = (text: string): string => `\u001B[33m${text}\u001B[0m`;
const magenta = (text: string): string => `\u001B[35m${text}\u001B[0m`;

const localeLabel = (locale: string): string => {
  if (locale === "en-US" || locale === "en") {
    return green("EN");
  }
  if (locale === "pt-BR" || locale === "pt-br") {
    return yellow("PT");
  }
  return dim(locale);
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) {
    return dim("unknown");
  }
  return dateStr.slice(0, 10);
};

const renderCard = (group: PostGroup, index: number): void => {
  const [primary] = group.locales;
  const localesAvailable = group.locales.map((l) => localeLabel(l.locale));
  const tags = primary.tags.slice(0, 5);
  const width = 64;
  const top = `┌${"─".repeat(width)}┐`;
  const bottom = `└${"─".repeat(width)}┘`;
  const separator = `├${"─".repeat(width)}┤`;
  const pad = (text: string, rawLen: number): string =>
    `│ ${text}${" ".repeat(Math.max(0, width - 2 - rawLen))} │`;

  const num = `#${index + 1}`;
  const titleText =
    primary.title.length > width - 8
      ? `${primary.title.slice(0, width - 11)}...`
      : primary.title;

  console.log(top);
  console.log(
    pad(`${bold(titleText)}  ${dim(num)}`, titleText.length + 2 + num.length)
  );
  console.log(separator);

  const dateLine = `${cyan(formatDate(primary.created))}  ${dim("·")}  ${localesAvailable.join(dim(" / "))}  ${dim("·")}  ${primary.hasCover ? green("◆") : dim("◇")} cover`;
  const dateLineRaw = `${formatDate(primary.created)}  ·  ${group.locales.map((l) => l.locale.slice(0, 2).toUpperCase()).join(" / ")}  ·  ◆ cover`;
  console.log(pad(dateLine, dateLineRaw.length));

  if (tags.length > 0) {
    const tagStr = tags.map((t) => magenta(t)).join(dim(", "));
    const tagRaw = tags.join(", ");
    console.log(pad(`${dim("Tags:")} ${tagStr}`, 6 + tagRaw.length));
  }

  if (group.locales.length > 1) {
    const maxSlug = width - 12;
    for (const locale of group.locales) {
      const displaySlug =
        locale.slug.length > maxSlug
          ? `${locale.slug.slice(0, maxSlug - 3)}...`
          : locale.slug;
      const slugLine = `  ${localeLabel(locale.locale)} ${dim("→")} /${displaySlug}`;
      const slugRaw = `  XX → /${displaySlug}`;
      console.log(pad(slugLine, slugRaw.length));
    }
  }

  const updated = formatDate(primary.updated);
  if (updated !== formatDate(primary.created)) {
    const updLine = `${dim("Updated:")} ${updated}`;
    console.log(pad(updLine, 9 + updated.length));
  }

  console.log(bottom);
};

const PAGE_SIZE = 5;

const renderPage = (
  groups: PostGroup[],
  page: number,
  totalPages: number
): void => {
  const start = page * PAGE_SIZE;
  const pageGroups = groups.slice(start, start + PAGE_SIZE);

  console.log();
  for (let i = 0; i < pageGroups.length; i += 1) {
    renderCard(pageGroups[i], start + i);
    if (i < pageGroups.length - 1) {
      console.log();
    }
  }

  console.log();
  console.log(
    dim(
      `  Page ${bold(String(page + 1))} of ${bold(String(totalPages))}  ${dim("·")}  ${groups.length} posts total`
    )
  );
  console.log();
};

const localeToShort = (locale: string): string => {
  if (locale === "en-US") {
    return "en";
  }
  if (locale === "pt-BR") {
    return "pt-br";
  }
  return locale.toLowerCase();
};

export default defineCommand({
  args: {
    dir: {
      alias: "d",
      default: "content/posts",
      description: "Posts directory",
      type: "string",
    },
    locale: {
      alias: "l",
      description: "Filter by locale (en, pt-br)",
      type: "string",
    },
    page: {
      alias: "p",
      default: "1",
      description: "Page number",
      type: "string",
    },
    tag: {
      alias: "t",
      description: "Filter by tag",
      type: "string",
    },
  },
  meta: {
    description: "List all blog posts",
    name: "list",
  },
  async run({ args }) {
    const postsDir = resolve(args.dir);
    let groups = await loadPosts(postsDir);

    if (args.locale) {
      const filter = args.locale.toLowerCase();
      groups = groups.filter((g) =>
        g.locales.some(
          (l) =>
            l.locale.toLowerCase().includes(filter) ||
            localeToShort(l.locale) === filter
        )
      );
    }

    if (args.tag) {
      const filter = args.tag.toLowerCase();
      groups = groups.filter((g) =>
        g.locales.some((l) =>
          l.tags.some((t) => t.toLowerCase().includes(filter))
        )
      );
    }

    if (groups.length === 0) {
      consola.warn("No posts found.");
      return;
    }

    const totalPages = Math.ceil(groups.length / PAGE_SIZE);
    let page = Math.max(
      0,
      Math.min(Number.parseInt(args.page, 10) - 1, totalPages - 1)
    );

    const { isTTY } = process.stdout;

    if (!isTTY) {
      renderPage(groups, page, totalPages);
      return;
    }

    let browsing = true;
    while (browsing) {
      renderPage(groups, page, totalPages);

      if (totalPages <= 1) {
        break;
      }

      const choices: string[] = [];
      if (page > 0) {
        choices.push("← Previous");
      }
      if (page < totalPages - 1) {
        choices.push("Next →");
      }
      choices.push("Quit");

      const action = await consola.prompt("Navigate:", {
        options: choices,
        type: "select",
      });

      if (action === "← Previous") {
        page -= 1;
      } else if (action === "Next →") {
        page += 1;
      } else {
        browsing = false;
      }
    }
  },
});
