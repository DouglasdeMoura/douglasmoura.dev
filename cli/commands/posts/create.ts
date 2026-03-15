import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve as resolvePath } from "node:path";

import slugify from "@sindresorhus/slugify";
import { defineCommand } from "citty";
import { bold, cyan, dim, green, yellow } from "colorette";
import { consola } from "consola";

const localeOptions = [
  { label: `${green("English")} (en-US)`, value: "en-US" },
  { label: `${yellow("Português")} (pt-BR)`, value: "pt-BR" },
] as const;

const localeToFile = (locale: string): string =>
  locale === "pt-BR" ? "pt-br.md" : "en.md";

const editorOptions = [
  { label: "Text editor (opens $EDITOR)", value: "editor" },
  { label: "Terminal textarea", value: "terminal" },
  { label: "Skip (write content later)", value: "skip" },
] as const;

const getEditor = (): string =>
  process.env.VISUAL || process.env.EDITOR || "vi";

const editInEditor = async (initial: string): Promise<string> => {
  const tmpFile = join(tmpdir(), `blog-post-${Date.now()}.md`);
  await writeFile(tmpFile, initial, "utf8");

  const editor = getEditor();
  const result = spawnSync(editor, [tmpFile], { stdio: "inherit" });

  if (result.status !== 0) {
    throw new Error(
      `Editor "${editor}" exited with code ${String(result.status)}`
    );
  }

  return readFile(tmpFile, "utf8");
};

const buildFrontmatter = (opts: {
  title: string;
  slug: string;
  locale: string;
  tags: string[];
  date: string;
}): string => {
  const lines = [
    "---",
    `title: ${opts.title}`,
    `slug: ${opts.slug}`,
    `locale: ${opts.locale}`,
    `created: ${opts.date}`,
    `updated: ${opts.date}`,
  ];

  if (opts.tags.length > 0) {
    lines.push("tags:");
    for (const tag of opts.tags) {
      lines.push(`  - ${tag}`);
    }
  }

  lines.push("---");
  return lines.join("\n");
};

const normalizeLocale = (input: string): string => {
  const normalized = input.toLowerCase();
  if (normalized === "en" || normalized === "en-us") {
    return "en-US";
  }
  if (normalized === "pt" || normalized === "pt-br") {
    return "pt-BR";
  }
  return input;
};

const promptLocale = async (isTTY: boolean, arg?: string): Promise<string> => {
  if (arg) {
    return normalizeLocale(arg);
  }
  if (!isTTY) {
    return "en-US";
  }
  return (await consola.prompt("Language:", {
    options: [...localeOptions],
    type: "select",
  })) as string;
};

const promptSlug = async (
  isTTY: boolean,
  argSlug: string | undefined,
  title: string
): Promise<string> => {
  const slug = argSlug || slugify(title);
  if (argSlug || !isTTY) {
    return slug;
  }

  const wantsCustom = await consola.prompt(`Slug: ${cyan(slug)}  Change?`, {
    initial: false,
    type: "confirm",
  });

  if (!wantsCustom) {
    return slug;
  }

  return (await consola.prompt("Custom slug:", {
    default: slug,
    type: "text",
  })) as string;
};

const parseTags = (input: string): string[] =>
  input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const promptTags = async (isTTY: boolean, arg?: string): Promise<string[]> => {
  if (arg) {
    return parseTags(arg);
  }
  if (!isTTY) {
    return [];
  }

  const tagInput = await consola.prompt("Tags (comma-separated):", {
    default: "",
    type: "text",
  });

  if (tagInput && typeof tagInput === "string") {
    return parseTags(tagInput);
  }
  return [];
};

const promptContent = async (
  isTTY: boolean,
  useEditor: boolean,
  title: string
): Promise<string> => {
  if (useEditor) {
    consola.info(`Opening ${bold(getEditor())}...`);
    return editInEditor(`# ${title}\n\n`);
  }

  if (!isTTY) {
    return "";
  }

  const editMode = (await consola.prompt("How to write the content?", {
    options: [...editorOptions],
    type: "select",
  })) as string;

  if (editMode === "editor") {
    consola.info(`Opening ${bold(getEditor())}...`);
    return editInEditor(`# ${title}\n\n`);
  }

  if (editMode === "terminal") {
    const input = await consola.prompt("Write your content (Markdown):", {
      type: "text",
    });
    if (input && typeof input === "string") {
      return input;
    }
  }

  return "";
};

const printSummary = (opts: {
  title: string;
  slug: string;
  locale: string;
  tags: string[];
  filePath: string;
  content: string;
}): void => {
  console.log();
  console.log(dim("─".repeat(60)));
  console.log();
  console.log(`  ${bold("Title:")}   ${opts.title}`);
  console.log(`  ${bold("Slug:")}    ${cyan(opts.slug)}`);
  console.log(
    `  ${bold("Locale:")}  ${opts.locale === "en-US" ? green("English") : yellow("Português")}`
  );
  console.log(
    `  ${bold("Tags:")}    ${opts.tags.length > 0 ? opts.tags.join(", ") : dim("none")}`
  );
  console.log(`  ${bold("Path:")}    ${dim(opts.filePath)}`);
  console.log(
    `  ${bold("Content:")} ${opts.content ? `${opts.content.split("\n").length} lines` : dim("empty")}`
  );
  console.log();
  console.log(dim("─".repeat(60)));
  console.log();
};

export default defineCommand({
  args: {
    dir: {
      alias: "d",
      default: "content/posts",
      description: "Posts directory",
      type: "string",
    },
    editor: {
      alias: "e",
      description: "Open text editor for content",
      type: "boolean",
    },
    locale: {
      alias: "l",
      description: "Locale (en-US or pt-BR)",
      type: "string",
    },
    slug: {
      alias: "s",
      description: "Custom slug (auto-generated from title if omitted)",
      type: "string",
    },
    tags: {
      description: "Comma-separated tags",
      type: "string",
    },
    title: {
      alias: "t",
      description: "Post title",
      type: "string",
    },
  },
  meta: {
    description: "Create a new blog post",
    name: "create",
  },
  async run({ args }) {
    const { isTTY } = process.stdout;

    consola.box("Create a new post");

    const title =
      args.title ||
      (isTTY && (await consola.prompt("Post title:", { type: "text" })));

    if (!title || typeof title !== "string") {
      consola.error("Title is required. Pass --title or run in a terminal.");
      return;
    }

    const locale = await promptLocale(isTTY, args.locale);
    const finalSlug = await promptSlug(isTTY, args.slug, title);
    const tags = await promptTags(isTTY, args.tags);
    const content = await promptContent(isTTY, !!args.editor, title);

    const now = new Date();
    const dirName = `${now.toISOString().slice(0, 10)}_${finalSlug}`;
    const postsDir = resolvePath(args.dir);
    const postDir = join(postsDir, dirName);
    const filePath = join(postDir, localeToFile(locale));

    if (existsSync(filePath)) {
      consola.error(`File already exists: ${filePath}`);
      return;
    }

    const frontmatter = buildFrontmatter({
      date: now.toISOString().replace("T", " "),
      locale,
      slug: finalSlug,
      tags,
      title,
    });

    const markdown = `${frontmatter}\n\n${content}`;

    printSummary({ content, filePath, locale, slug: finalSlug, tags, title });

    if (isTTY) {
      const confirmed = await consola.prompt("Create this post?", {
        initial: true,
        type: "confirm",
      });

      if (!confirmed) {
        consola.info("Aborted.");
        return;
      }
    }

    await mkdir(postDir, { recursive: true });
    await writeFile(filePath, markdown, "utf8");

    consola.success(`Created ${bold(filePath)}`);

    if (!content) {
      consola.info(`Edit the post at: ${cyan(filePath)}`);
    }
  },
});
