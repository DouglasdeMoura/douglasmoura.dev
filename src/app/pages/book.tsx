import { Breadcrumbs } from "#app/components/breadcrumbs.js";
import { PageSeo } from "#app/components/page-seo.js";
import { getBookAlternates } from "#app/lib/books.js";
import type { Book, BookChapter } from "#app/lib/books.js";
import { formatDate, t } from "#app/lib/i18n.js";

interface BookPageProps {
  book: Book;
  chapters: BookChapter[];
  siteUrl: string;
  basePath: string;
}

export const BookPage = ({
  book,
  chapters,
  siteUrl,
  basePath,
}: BookPageProps) => {
  const url = `${siteUrl}${basePath}/books/${book.slug}`;
  const alternates = getBookAlternates(book.slug);
  const enSlug =
    book.locale === "en-US"
      ? book.slug
      : (alternates.find((item) => item.locale === "en-US")?.slug ?? book.slug);
  const seoAlternates = [
    { href: url, hrefLang: book.locale },
    ...alternates.map((alt) => ({
      href: `${siteUrl}${alt.locale === "pt-BR" ? "/pt-BR" : ""}/books/${alt.slug}`,
      hrefLang: alt.locale,
    })),
    { href: `${siteUrl}/books/${enSlug}`, hrefLang: "x-default" },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    dateModified: book.updated,
    datePublished: book.created,
    description: book.description,
    inLanguage: book.locale,
    name: book.title,
    url,
  };

  return (
    <>
      <PageSeo
        title={`${book.title} | ${t("Books")}`}
        description={book.description}
        url={url}
        alternates={seoAlternates}
        jsonLd={jsonLd}
      />
      <article className="prose mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            { href: basePath || "/", label: t("Home") },
            { href: `${basePath}/books`, label: t("Books") },
            { label: book.title },
          ]}
        />
        <header className="not-prose mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-text-strong leading-[1.15]">
            {book.title}
          </h1>
          <p className="mt-3 text-sm text-text-muted tracking-wide">
            {t("Published on")} {formatDate(book.created)} · {book.chapterCount}{" "}
            {t("chapters")}
          </p>
          <p className="mt-1 text-sm text-text-muted tracking-wide">
            {t("Status")}: {book.status}
          </p>
          <p className="mt-1 text-sm text-text-muted tracking-wide">
            {t("Version")} {book.version} · {t("Edition")} {book.edition} ·{" "}
            <a
              href={`${basePath}/books/${book.slug}/changelog`}
              className="underline underline-offset-2 decoration-border hover:decoration-text-strong"
            >
              Changelog
            </a>
          </p>
        </header>

        {book.cover && (
          <img
            src={book.cover}
            alt={book.title}
            width={900}
            height={600}
            className="not-prose mb-10 w-full aspect-3/2 rounded-xl border border-border bg-surface-1 object-cover"
          />
        )}

        <p>{book.description}</p>

        <section className="not-prose mt-10">
          <h2 className="text-lg font-semibold text-text-strong">
            {t("Table of contents")}
          </h2>
          {chapters.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">
              {t("No chapters yet.")}
            </p>
          ) : (
            <ol className="mt-3 space-y-2">
              {chapters.map((chapter) => (
                <li key={chapter.slug} className="text-sm text-text">
                  <a
                    href={`${basePath}/books/${book.slug}/${chapter.slug}`}
                    className="no-underline hover:underline hover:decoration-border hover:underline-offset-2"
                  >
                    {chapter.order}. {chapter.title}
                  </a>
                </li>
              ))}
            </ol>
          )}
        </section>
      </article>
    </>
  );
};
