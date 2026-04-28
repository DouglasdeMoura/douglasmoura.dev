import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve as resolvePath } from "node:path";

import slugify from "@sindresorhus/slugify";
import { defineCommand } from "citty";
import { bold, cyan } from "colorette";
import { consola } from "consola";

const buildMeta = (opts: {
  title: string;
  slug: string;
  locale: string;
  tags: string[];
  date: string;
  status: "draft" | "beta" | "published";
}): string =>
  JSON.stringify(
    {
      edition: "1st",
      locales: {
        [opts.locale]: {
          created: opts.date,
          description: "Write your book description here.",
          title: opts.title,
          updated: opts.date,
        },
      },
      slug: opts.slug,
      status: opts.status,
      tags: opts.tags,
      version: "0.1.0",
    },
    null,
    2
  );

const parseTags = (input: string): string[] =>
  input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default defineCommand({
  args: {
    dir: {
      alias: "d",
      default: "content/books",
      description: "Books directory",
      type: "string",
    },
    locale: {
      alias: "l",
      default: "en-US",
      description: "Book locale (en-US or pt-BR)",
      type: "string",
    },
    slug: {
      alias: "s",
      description: "Book slug (auto-generated from title if omitted)",
      type: "string",
    },
    status: {
      default: "draft",
      description: "Publishing status (draft, beta, published)",
      type: "string",
    },
    tags: {
      description: "Comma-separated tags",
      type: "string",
    },
    title: {
      alias: "t",
      description: "Book title",
      type: "string",
    },
  },
  meta: {
    description: "Create a new technical book scaffold",
    name: "create",
  },
  async run({ args }) {
    const { isTTY } = process.stdout;
    const title =
      args.title ||
      (isTTY && (await consola.prompt("Book title:", { type: "text" })));

    if (!title || typeof title !== "string") {
      consola.error("Title is required. Pass --title or run in a terminal.");
      return;
    }

    const slug = args.slug || slugify(title);
    const status =
      args.status === "beta" || args.status === "published"
        ? args.status
        : "draft";
    const now = new Date().toISOString().replace("T", " ");
    const tags = args.tags ? parseTags(args.tags) : [];

    const booksDir = resolvePath(args.dir);
    const bookDir = join(booksDir, slug);
    const metaPath = join(bookDir, "meta.json");
    const chapterLocale = args.locale || "en-US";
    const chapterPath = join(
      bookDir,
      "chapters",
      chapterLocale,
      chapterLocale === "pt-BR" ? "01-introducao.md" : "01-introduction.md"
    );

    if (existsSync(metaPath)) {
      consola.error(`Book already exists: ${metaPath}`);
      return;
    }

    await mkdir(join(bookDir, "chapters", chapterLocale), { recursive: true });

    await writeFile(
      metaPath,
      buildMeta({
        date: now,
        locale: chapterLocale,
        slug,
        status,
        tags,
        title,
      }),
      "utf8"
    );

    await writeFile(
      chapterPath,
      [
        "---",
        `title: "${chapterLocale === "pt-BR" ? "Introducao" : "Introduction"}"`,
        `slug: ${chapterLocale === "pt-BR" ? "introducao" : "introduction"}`,
        `locale: ${chapterLocale}`,
        "order: 1",
        `created: ${now}`,
        `updated: ${now}`,
        "---",
        "",
        chapterLocale === "pt-BR"
          ? "Primeiro capitulo do livro."
          : "First chapter of the book.",
      ].join("\n"),
      "utf8"
    );

    consola.success(`Created ${bold(metaPath)}`);
    consola.info(`First chapter scaffold: ${cyan(chapterPath)}`);
  },
});
