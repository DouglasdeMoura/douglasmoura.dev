import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { join, resolve as resolvePath } from "node:path";

import { defineCommand } from "citty";
import { consola } from "consola";
// @ts-expect-error md4x lacks proper type exports
import { renderToAnsi } from "md4x";

import type { PostGroup } from "./shared.js";
import { loadPosts, parseFrontmatter, stripFrontmatter } from "./shared.js";

const dim = (text: string): string => `\u001B[2m${text}\u001B[0m`;
const bold = (text: string): string => `\u001B[1m${text}\u001B[0m`;
const cyan = (text: string): string => `\u001B[36m${text}\u001B[0m`;
const green = (text: string): string => `\u001B[32m${text}\u001B[0m`;
const yellow = (text: string): string => `\u001B[33m${text}\u001B[0m`;
const magenta = (text: string): string => `\u001B[35m${text}\u001B[0m`;

const localeLabel = (locale: string): string => {
  if (locale === "en-US") {
    return green("English");
  }
  if (locale === "pt-BR") {
    return yellow("Português");
  }
  return locale;
};

const renderHeader = (
  title: string,
  locale: string,
  date: string,
  tags: string[]
): string => {
  const width = 72;
  const hrule = dim("─".repeat(width));
  const lines: string[] = [
    "",
    hrule,
    "",
    `  ${bold(title)}`,
    "",
    `  ${cyan(date.slice(0, 10))}  ${dim("·")}  ${localeLabel(locale)}`,
  ];

  if (tags.length > 0) {
    lines.push(`  ${tags.map((t) => magenta(t)).join(dim("  ·  "))}`);
  }

  lines.push("", hrule, "");
  return lines.join("\n");
};

const pipeToLess = async (content: string): Promise<void> => {
  const less = spawn("less", ["-R", "-S", "--quit-if-one-screen"], {
    stdio: ["pipe", "inherit", "inherit"],
  });
  less.stdin.write(content);
  less.stdin.end();
  await once(less, "close");
};

const findPost = (
  groups: PostGroup[],
  query: string
): PostGroup | undefined => {
  const q = query.toLowerCase();

  // Exact slug match
  const exact = groups.find((g) => g.slug === q);
  if (exact) {
    return exact;
  }

  // Partial slug match
  const partial = groups.find((g) => g.slug.includes(q));
  if (partial) {
    return partial;
  }

  // Title match
  return groups.find((g) =>
    g.locales.some((l) => l.title.toLowerCase().includes(q))
  );
};

const resolveLocaleFile = (locale: string): string => {
  if (locale === "en-US") {
    return "en.md";
  }
  if (locale === "pt-BR") {
    return "pt-br.md";
  }
  return `${locale.toLowerCase()}.md`;
};

const readPost = async (
  postsDir: string,
  group: PostGroup,
  locale: string
): Promise<string> => {
  const file = resolveLocaleFile(locale);
  const filePath = join(postsDir, group.dir, file);
  const raw = await readFile(filePath, "utf8");
  const meta = parseFrontmatter(raw);
  const body = stripFrontmatter(raw);

  const title = (meta.title as string) || group.slug;
  const date = (meta.created as string) || group.date;
  const tags = (meta.tags as string[]) || [];

  const header = renderHeader(title, locale, date, tags);
  const rendered = renderToAnsi(body, { showUrls: true });

  return `${header}\n${rendered}\n`;
};

const selectPost = async (groups: PostGroup[]): Promise<PostGroup> => {
  const options = groups.map((g) => {
    const [primary] = g.locales;
    const langs = g.locales
      .map((l) => (l.locale === "en-US" ? "EN" : "PT"))
      .join("/");
    return {
      label: `${primary.title}  ${dim(`(${g.date} · ${langs})`)}`,
      value: g.slug,
    };
  });

  const selected = await consola.prompt("Select a post:", {
    options,
    type: "select",
  });

  const post = groups.find((g) => g.slug === selected);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

const selectLocale = async (group: PostGroup): Promise<string> => {
  if (group.locales.length === 1) {
    return group.locales[0].locale;
  }

  const options = group.locales.map((l) => ({
    label: `${localeLabel(l.locale)}  ${dim(`— ${l.title}`)}`,
    value: l.locale,
  }));

  const selected = await consola.prompt("Which language?", {
    options,
    type: "select",
  });

  return selected as string;
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
      description: "Locale to read (en, pt-br)",
      type: "string",
    },
    slug: {
      description: "Post slug or search term",
      required: false,
      type: "positional",
    },
  },
  meta: {
    description: "Read a blog post in the terminal",
    name: "read",
  },
  async run({ args }) {
    const postsDir = resolvePath(args.dir);
    const groups = await loadPosts(postsDir);

    if (groups.length === 0) {
      consola.warn("No posts found.");
      return;
    }

    let group: PostGroup | undefined;

    if (args.slug) {
      group = findPost(groups, args.slug);
      if (!group) {
        consola.error(`No post matching "${args.slug}".`);
        return;
      }
    } else {
      group = await selectPost(groups);
    }

    let locale: string;
    const localeArg = args.locale;
    if (localeArg) {
      const match = group.locales.find((l) =>
        l.locale.toLowerCase().startsWith(localeArg.toLowerCase())
      );
      if (!match) {
        consola.error(
          `Locale "${localeArg}" not available. Available: ${group.locales.map((l) => l.locale).join(", ")}`
        );
        return;
      }
      ({ locale } = match);
    } else {
      locale = await selectLocale(group);
    }

    const content = await readPost(postsDir, group, locale);

    if (process.stdout.isTTY) {
      await pipeToLess(content);
    } else {
      process.stdout.write(content);
    }
  },
});
