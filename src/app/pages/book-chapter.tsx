import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";

import { Breadcrumbs } from "#app/components/breadcrumbs.js";
import { PageSeo } from "#app/components/page-seo.js";
import type { AdjacentChapters, Book, BookChapter } from "#app/lib/books.js";
import { formatDate, t } from "#app/lib/i18n.js";

interface BookChapterPageProps {
  book: Book;
  chapter: BookChapter;
  html: string;
  hasMath: boolean;
  adjacent: AdjacentChapters;
  basePath: string;
  siteUrl: string;
}

export const BookChapterPage = ({
  book,
  chapter,
  html,
  hasMath,
  adjacent,
  basePath,
  siteUrl,
}: BookChapterPageProps) => {
  const url = `${siteUrl}${basePath}/books/${book.slug}/${chapter.slug}`;

  return (
    <>
      <PageSeo
        title={`${chapter.title} | ${book.title}`}
        description={book.description}
        url={url}
      />
      {hasMath && <link rel="stylesheet" href="/katex/katex.min.css" />}
      <article className="prose mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            { href: basePath || "/", label: t("Home") },
            { href: `${basePath}/books`, label: t("Books") },
            { href: `${basePath}/books/${book.slug}`, label: book.title },
            { label: chapter.title },
          ]}
        />
        <header className="not-prose mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-text-strong leading-[1.15]">
            {chapter.title}
          </h1>
          <p className="mt-3 text-sm text-text-muted tracking-wide">
            {t("Published on")} {formatDate(chapter.created)}
          </p>
        </header>

        {/* oxlint-disable-next-line eslint-plugin-react(no-danger) -- rendered from trusted local markdown files */}
        <div dangerouslySetInnerHTML={{ __html: html }} />

        {(adjacent.prev || adjacent.next) && (
          <nav
            aria-label={t("Pagination")}
            className="not-prose border-t border-border pt-8 grid grid-cols-2 gap-4 mt-10"
          >
            {adjacent.prev ? (
              <a
                href={`${basePath}/books/${book.slug}/${adjacent.prev.slug}`}
                className="group flex flex-col gap-1 no-underline"
              >
                <span className="flex items-center gap-1 text-xs tracking-wide text-text-muted uppercase">
                  <ArrowLeftIcon
                    size={14}
                    className="motion-safe:transition-transform motion-safe:duration-150 group-hover:-translate-x-0.5"
                  />
                  {t("Previous")}
                </span>
                <span className="text-sm font-medium text-text-muted group-hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150">
                  {adjacent.prev.title}
                </span>
              </a>
            ) : (
              <span />
            )}
            {adjacent.next ? (
              <a
                href={`${basePath}/books/${book.slug}/${adjacent.next.slug}`}
                className="group flex flex-col items-end gap-1 text-right no-underline"
              >
                <span className="flex items-center gap-1 text-xs tracking-wide text-text-muted uppercase">
                  {t("Next")}
                  <ArrowRightIcon
                    size={14}
                    className="motion-safe:transition-transform motion-safe:duration-150 group-hover:translate-x-0.5"
                  />
                </span>
                <span className="text-sm font-medium text-text-muted group-hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150">
                  {adjacent.next.title}
                </span>
              </a>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </>
  );
};
