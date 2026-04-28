import { Breadcrumbs } from "#app/components/breadcrumbs.js";
import { PageSeo } from "#app/components/page-seo.js";
import type { Book } from "#app/lib/books.js";
import { formatDate, t } from "#app/lib/i18n.js";

interface BookPageProps {
  book: Book;
  siteUrl: string;
  basePath: string;
}

export const BookPage = ({ book, siteUrl, basePath }: BookPageProps) => {
  const url = `${siteUrl}${basePath}/books/${book.slug}`;

  return (
    <>
      <PageSeo
        title={`${book.title} | ${t("Books")}`}
        description={book.description}
        url={url}
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
      </article>
    </>
  );
};
