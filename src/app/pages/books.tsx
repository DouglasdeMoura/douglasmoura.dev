import { PageSeo } from "#app/components/page-seo.js";
import { PrefetchLink } from "#app/components/prefetch-link.js";
import type { Book } from "#app/lib/books.js";
import { formatDateShort, t } from "#app/lib/i18n.js";

interface BooksPageProps {
  books: Book[];
  siteUrl: string;
  basePath: string;
}

export const BooksPage = ({ books, siteUrl, basePath }: BooksPageProps) => {
  const pageUrl = `${siteUrl}${basePath}/books`;

  return (
    <>
      <PageSeo
        title={t("Books | Douglas Moura")}
        description={t(
          "Technical books and long-form guides by Douglas Moura."
        )}
        url={pageUrl}
      />

      <section className="prose mx-auto py-10 px-4">
        <h1 className="not-prose text-lg font-normal text-text -tracking-[0.01em] mt-0 mb-8 leading-relaxed">
          {t("Books")}
        </h1>

        {books.length === 0 ? (
          <p className="not-prose text-text-muted">
            {t("No books published yet.")}
          </p>
        ) : (
          <div className="not-prose">
            {books.map((book) => (
              <article
                key={book.slug}
                className="py-3 border-b border-border last:border-b-0"
              >
                <h2 className="m-0 text-base font-medium">
                  <PrefetchLink
                    href={`${basePath}/books/${book.slug}`}
                    className="text-text-strong -tracking-[0.01em] no-underline hover:text-accent motion-safe:transition-colors motion-safe:duration-150"
                  >
                    {book.title}
                  </PrefetchLink>
                </h2>
                <p className="mt-1 mb-1 text-sm text-text-muted">
                  {book.description}
                </p>
                <p className="m-0 text-xs text-text-muted tabular-nums">
                  {formatDateShort(book.created)} · {book.chapterCount}{" "}
                  {t("chapters")} · {book.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};
