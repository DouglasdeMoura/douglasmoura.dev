import matter from "gray-matter";

const bookMetaModules = import.meta.glob("/content/books/**/meta.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const coverImages = import.meta.glob(
  "/content/books/**/cover.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: "?url" }
) as Record<string, string>;

const chapterModules = import.meta.glob("/content/books/**/chapters/**/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export interface BookAlternate {
  locale: "en-US" | "pt-BR";
  slug: string;
}

export interface Book {
  title: string;
  slug: string;
  locale: "en-US" | "pt-BR";
  created: string;
  updated: string;
  tags: string[];
  description: string;
  cover: string;
  status: "draft" | "beta" | "published";
  chapterCount: number;
}

const booksBySlug = new Map<string, Book>();
const alternatesBySlug = new Map<string, BookAlternate[]>();
const dirToSlugs = new Map<string, BookAlternate[]>();

const chapterCountByBookAndLocale = new Map<string, number>();

for (const [path, raw] of Object.entries(chapterModules)) {
  const { data } = matter(raw);
  const pathParts = path.split("/");
  const bookSlug = pathParts[pathParts.indexOf("books") + 1];
  const locale: Book["locale"] = data.locale === "pt-BR" ? "pt-BR" : "en-US";
  const key = `${bookSlug}:${locale}`;
  chapterCountByBookAndLocale.set(
    key,
    (chapterCountByBookAndLocale.get(key) ?? 0) + 1
  );
}

for (const [path, raw] of Object.entries(bookMetaModules)) {
  const { content, data } = matter(raw);
  const slug = data.slug as string | undefined;
  if (!slug) {
    continue;
  }

  const dir = path.slice(0, path.lastIndexOf("/") + 1);
  const coverKey = Object.keys(coverImages).find((key) => key.startsWith(dir));
  const locale: Book["locale"] = data.locale === "pt-BR" ? "pt-BR" : "en-US";
  const chapterKey = `${slug}:${locale}`;

  booksBySlug.set(slug, {
    chapterCount: chapterCountByBookAndLocale.get(chapterKey) ?? 0,
    cover: coverKey ? coverImages[coverKey] : "",
    created:
      data.created instanceof Date
        ? data.created.toISOString()
        : String(data.created ?? ""),
    description: content.trim(),
    locale,
    slug,
    status:
      data.status === "beta" || data.status === "published"
        ? data.status
        : "draft",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    title: (data.title as string) || slug,
    updated:
      data.updated instanceof Date
        ? data.updated.toISOString()
        : String(data.updated ?? ""),
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

const sortedBooks = [...booksBySlug.values()].toSorted(
  (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
);

export const getAllBooks = (): Book[] => sortedBooks;

export const getBooksByLocale = (locale: Book["locale"]): Book[] =>
  sortedBooks.filter((book) => book.locale === locale);

export const getBookBySlug = (slug: string): Book | undefined =>
  booksBySlug.get(slug);

export const getBookAlternates = (slug: string): BookAlternate[] =>
  alternatesBySlug.get(slug) ?? [];
