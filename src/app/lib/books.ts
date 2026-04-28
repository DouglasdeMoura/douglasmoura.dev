import matter from "gray-matter";

interface BookMetaLocale {
  title?: string;
  description?: string;
  created?: string;
  updated?: string;
}

interface BookMetaFile {
  slug?: string;
  status?: "draft" | "beta" | "published";
  edition?: string;
  version?: string;
  cover?: string;
  tags?: string[];
  locales?: Record<string, BookMetaLocale>;
}

const bookMetaModules = import.meta.glob("/content/books/**/meta.json", {
  eager: true,
  import: "default",
}) as Record<string, BookMetaFile>;

const coverImages = import.meta.glob(
  "/content/books/**/cover.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: "?url" }
) as Record<string, string>;

const chapterModules = import.meta.glob("/content/books/**/chapters/**/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;
const changelogModules = import.meta.glob("/content/books/**/changelog.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export interface BookAlternate {
  locale: string;
  slug: string;
}

export interface Book {
  title: string;
  slug: string;
  locale: string;
  created: string;
  updated: string;
  tags: string[];
  description: string;
  cover: string;
  status: "draft" | "beta" | "published";
  edition: string;
  version: string;
  chapterCount: number;
}

export interface BookChapter {
  title: string;
  slug: string;
  locale: string;
  order: number;
  created: string;
  updated: string;
  body: string;
  bookSlug: string;
}

export interface AdjacentChapters {
  prev: Pick<BookChapter, "slug" | "title"> | null;
  next: Pick<BookChapter, "slug" | "title"> | null;
}

const booksBySlug = new Map<string, Book>();
const booksBySlugLocale = new Map<string, Book>();
const alternatesBySlug = new Map<string, BookAlternate[]>();
const dirToSlugs = new Map<string, BookAlternate[]>();
const chaptersByBookAndLocale = new Map<string, BookChapter[]>();

const chapterCountByBookAndLocale = new Map<string, number>();
const changelogByBookSlug = new Map<string, string>();
const chapterAlternatesByKey = new Map<
  string,
  { locale: string; slug: string }[]
>();
const slugLocaleKey = (slug: string, locale: string): string =>
  `${slug}:${locale}`;

for (const [path, raw] of Object.entries(chapterModules)) {
  const { content, data } = matter(raw);
  const pathParts = path.split("/");
  const bookSlug = pathParts[pathParts.indexOf("books") + 1];
  const locale = (data.locale as string) || "en-US";
  const key = `${bookSlug}:${locale}`;
  chapterCountByBookAndLocale.set(
    key,
    (chapterCountByBookAndLocale.get(key) ?? 0) + 1
  );

  const chapter: BookChapter = {
    body: content,
    bookSlug,
    created:
      data.created instanceof Date
        ? data.created.toISOString()
        : String(data.created ?? ""),
    locale,
    order:
      typeof data.order === "number"
        ? data.order
        : Number.parseInt(String(data.order ?? "0"), 10) || 0,
    slug: (data.slug as string) || "",
    title: (data.title as string) || "",
    updated:
      data.updated instanceof Date
        ? data.updated.toISOString()
        : String(data.updated ?? ""),
  };

  const chapters = chaptersByBookAndLocale.get(key) ?? [];
  chapters.push(chapter);
  chaptersByBookAndLocale.set(key, chapters);
}

for (const [path, raw] of Object.entries(changelogModules)) {
  const pathParts = path.split("/");
  const bookSlug = pathParts[pathParts.indexOf("books") + 1];
  if (bookSlug) {
    changelogByBookSlug.set(bookSlug, raw);
  }
}

for (const [path, data] of Object.entries(bookMetaModules)) {
  const slug = data.slug as string | undefined;
  if (!slug) {
    continue;
  }

  const dir = path.slice(0, path.lastIndexOf("/") + 1);
  const coverKey = Object.keys(coverImages).find((key) => key.startsWith(dir));
  const locales = Object.entries(data.locales ?? {});
  const fallbackLocales: [string, BookMetaLocale][] =
    locales.length > 0
      ? locales
      : [
          [
            "en-US",
            {
              description: "",
              title: slug,
            } satisfies BookMetaLocale,
          ],
        ];

  for (const [locale, localeData] of fallbackLocales) {
    const chapterKey = `${slug}:${locale}`;
    const created = localeData.created ?? new Date().toISOString();
    const updated = localeData.updated ?? created;

    const book: Book = {
      chapterCount: chapterCountByBookAndLocale.get(chapterKey) ?? 0,
      cover: coverKey ? coverImages[coverKey] : "",
      created,
      description: localeData.description?.trim() ?? "",
      edition: data.edition || "1st",
      locale,
      slug,
      status:
        data.status === "beta" || data.status === "published"
          ? data.status
          : "draft",
      tags: Array.isArray(data.tags) ? data.tags : [],
      title: localeData.title || slug,
      updated,
      version: data.version || "0.1.0",
    };

    booksBySlugLocale.set(slugLocaleKey(slug, locale), book);
    if (!booksBySlug.has(slug) && locale === "en-US") {
      booksBySlug.set(slug, book);
    }
    if (!booksBySlug.has(slug)) {
      booksBySlug.set(slug, book);
    }

    const group = dirToSlugs.get(dir) ?? [];
    group.push({ locale, slug });
    dirToSlugs.set(dir, group);
  }
}

for (const group of dirToSlugs.values()) {
  if (group.length < 2) {
    continue;
  }
  for (const item of group) {
    alternatesBySlug.set(
      slugLocaleKey(item.slug, item.locale),
      group.filter(
        (alt) => !(alt.slug === item.slug && alt.locale === item.locale)
      )
    );
  }
}

for (const [key, chapters] of chaptersByBookAndLocale.entries()) {
  chaptersByBookAndLocale.set(
    key,
    chapters.toSorted(
      (a, b) => a.order - b.order || a.slug.localeCompare(b.slug)
    )
  );
}

for (const chapters of chaptersByBookAndLocale.values()) {
  for (const chapter of chapters) {
    const chapterKey = `${chapter.bookSlug}:${chapter.order}`;
    const group = chapterAlternatesByKey.get(chapterKey) ?? [];
    group.push({ locale: chapter.locale, slug: chapter.slug });
    chapterAlternatesByKey.set(chapterKey, group);
  }
}

const sortedBooks = [...booksBySlugLocale.values()].toSorted(
  (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
);

export const getAllBooks = (): Book[] => sortedBooks;

export const getBooksByLocale = (locale: string): Book[] =>
  sortedBooks.filter((book) => book.locale === locale);

export const getBookBySlug = (
  slug: string,
  locale?: string
): Book | undefined =>
  locale
    ? booksBySlugLocale.get(slugLocaleKey(slug, locale))
    : booksBySlug.get(slug);

export const getBookAlternates = (
  slug: string,
  locale: string
): BookAlternate[] => alternatesBySlug.get(slugLocaleKey(slug, locale)) ?? [];

export const getBookChapters = (
  bookSlug: string,
  locale: string
): BookChapter[] => chaptersByBookAndLocale.get(`${bookSlug}:${locale}`) ?? [];

export const getBookChapterBySlug = (
  bookSlug: string,
  chapterSlug: string,
  locale: string
): BookChapter | undefined =>
  getBookChapters(bookSlug, locale).find(
    (chapter) => chapter.slug === chapterSlug
  );

export const getAdjacentChapters = (
  bookSlug: string,
  chapterSlug: string,
  locale: string
): AdjacentChapters => {
  const chapters = getBookChapters(bookSlug, locale);
  const index = chapters.findIndex((chapter) => chapter.slug === chapterSlug);
  if (index === -1) {
    return { next: null, prev: null };
  }

  const prev = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;
  return {
    next: next ? { slug: next.slug, title: next.title } : null,
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
  };
};

export const getChapterAlternates = (
  bookSlug: string,
  chapterSlug: string,
  locale: string
): { locale: string; slug: string }[] => {
  const chapter = getBookChapterBySlug(bookSlug, chapterSlug, locale);
  if (!chapter) {
    return [];
  }

  const key = `${bookSlug}:${chapter.order}`;
  const group = chapterAlternatesByKey.get(key) ?? [];
  return group.filter(
    (item) => item.slug !== chapterSlug || item.locale !== locale
  );
};

export const getBookChangelog = (bookSlug: string): string | undefined =>
  changelogByBookSlug.get(bookSlug);
