import { resolve } from "node:path";

import { defineCommand } from "citty";
import { bold, cyan, dim, green, magenta, yellow } from "colorette";
import { consola } from "consola";

import { loadBooks } from "./shared.js";

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
      description: "Filter by locale (en-US or pt-BR)",
      type: "string",
    },
    tag: {
      alias: "t",
      description: "Filter by tag",
      type: "string",
    },
  },
  meta: {
    description: "List technical books",
    name: "list",
  },
  async run({ args }) {
    const booksDir = resolve(args.dir);
    let books = await loadBooks(booksDir);

    if (args.locale) {
      const localeFilter = args.locale.toLowerCase();
      books = books.filter(
        (book) => book.locale.toLowerCase() === localeFilter
      );
    }

    if (args.tag) {
      const tagFilter = args.tag.toLowerCase();
      books = books.filter((book) =>
        book.tags.some((tag) => tag.toLowerCase().includes(tagFilter))
      );
    }

    if (books.length === 0) {
      consola.warn("No books found.");
      return;
    }

    for (const [index, book] of books.entries()) {
      const title = `${bold(book.title)} ${dim(`#${index + 1}`)}`;
      const meta = `${cyan(formatDate(book.created))} · ${localeLabel(book.locale)} · ${magenta(book.status)}`;
      const tags =
        book.tags.length > 0
          ? book.tags.map((tag) => magenta(tag)).join(dim(", "))
          : dim("none");

      console.log(title);
      console.log(`  ${dim("Slug:")} /${book.slug}`);
      console.log(`  ${dim("Meta:")} ${meta}`);
      console.log(`  ${dim("Tags:")} ${tags}`);
      console.log();
    }
  },
});
