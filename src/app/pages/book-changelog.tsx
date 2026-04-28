import { Breadcrumbs } from "#app/components/breadcrumbs.js";
import { PageSeo } from "#app/components/page-seo.js";
import type { Book } from "#app/lib/books.js";
import { t } from "#app/lib/i18n.js";

interface BookChangelogPageProps {
  book: Book;
  html: string;
  hasMath: boolean;
  siteUrl: string;
  basePath: string;
}

export const BookChangelogPage = ({
  book,
  html,
  hasMath,
  siteUrl,
  basePath,
}: BookChangelogPageProps) => {
  const url = `${siteUrl}${basePath}/books/${book.slug}/changelog`;

  return (
    <>
      <PageSeo
        title={`${book.title} changelog | ${t("Books")}`}
        description={`Release notes and updates for ${book.title}.`}
        url={url}
      />
      {hasMath && <link rel="stylesheet" href="/katex/katex.min.css" />}
      <article className="prose mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            { href: basePath || "/", label: t("Home") },
            { href: `${basePath}/books`, label: t("Books") },
            { href: `${basePath}/books/${book.slug}`, label: book.title },
            { label: "Changelog" },
          ]}
        />
        <header className="not-prose mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-text-strong leading-[1.15]">
            {book.title} changelog
          </h1>
          <p className="mt-3 text-sm text-text-muted tracking-wide">
            {t("Version")} {book.version} · {t("Edition")} {book.edition}
          </p>
        </header>

        {/* oxlint-disable-next-line eslint-plugin-react(no-danger) -- rendered from trusted local markdown files */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </>
  );
};
