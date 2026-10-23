import { PageSeo } from "#app/components/page-seo.js";
import { PrefetchLink } from "#app/components/prefetch-link.js";
import { TagLink } from "#app/components/tag-link.js";
import { formatDate, t } from "#app/lib/i18n.js";
import type { SearchResult } from "#app/lib/search.js";

interface SearchPageProps {
  query: string;
  results: SearchResult[];
  count: number;
  siteUrl: string;
  localePrefix?: string;
}

export const SearchPage = ({
  query,
  results,
  count,
  siteUrl,
  localePrefix = "",
}: SearchPageProps) => {
  const canonicalUrl = `${siteUrl}${localePrefix}/search${query ? `?q=${encodeURIComponent(query)}` : ""}`;
  const title = query
    ? `${t("Search results for")} \u201C${query}\u201D | Douglas Moura`
    : `${t("Search")} | Douglas Moura`;

  const enUrl = `${siteUrl}/search${query ? `?q=${encodeURIComponent(query)}` : ""}`;
  const ptUrl = `${siteUrl}/pt-BR/search${query ? `?q=${encodeURIComponent(query)}` : ""}`;
  const alternates = [
    { href: enUrl, hrefLang: "en-US" },
    { href: ptUrl, hrefLang: "pt-BR" },
    { href: enUrl, hrefLang: "x-default" },
  ];

  return (
    <>
      <PageSeo
        title={title}
        description={title}
        url={canonicalUrl}
        alternates={alternates}
        robots="noindex"
      />

      <section className="prose mx-auto py-10">
        <header className="not-prose mb-8 px-4">
          {query ? (
            <>
              <h1 className="text-text-strong text-2xl font-bold tracking-tight">
                {t("Search results for")} &ldquo;{query}&rdquo;
              </h1>
              <p className="text-text-muted mt-2 text-sm">
                {count} {count === 1 ? t("result") : t("results")}
              </p>
            </>
          ) : (
            <h1 className="text-text-strong text-2xl font-bold tracking-tight">
              {t("Search")}
            </h1>
          )}
          <form method="GET" action={`${localePrefix}/search`} className="mt-4">
            <input
              aria-label={t("Search")}
              name="q"
              type="search"
              defaultValue={query}
              placeholder={t("Enter a search term")}
              className="border-border bg-surface-0 text-text placeholder:text-text-muted focus:border-accent w-full rounded-lg border px-4 py-2 text-sm ring-0 outline-none"
            />
          </form>
        </header>

        {query && results.length === 0 && (
          <p className="text-text-muted px-4">{t("No results found")}</p>
        )}

        {results.length > 0 && (
          <div className="not-prose divide-border divide-y">
            {results.map((post) => (
              <article key={post.slug} className="px-4 py-5 first:pt-0">
                <h2 className="mt-0 text-xl">
                  <PrefetchLink
                    href={`/${post.slug}`}
                    className="text-text-strong hover:text-accent font-semibold -tracking-[0.01em] no-underline motion-safe:transition-colors motion-safe:duration-150"
                  >
                    {post.title}
                  </PrefetchLink>
                </h2>
                <time
                  dateTime={post.created}
                  className="text-text-muted mt-1 block text-sm tracking-wide"
                >
                  {formatDate(post.created)}
                </time>
                <p className="text-text-muted mt-2 mb-0 leading-relaxed">
                  {post.description}
                </p>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tagName) => (
                      <TagLink key={tagName} tag={tagName} />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {!query && (
          <p className="text-text-muted px-4">{t("Enter a search term")}</p>
        )}
      </section>
    </>
  );
};
