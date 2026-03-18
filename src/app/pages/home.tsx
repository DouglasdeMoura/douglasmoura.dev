import { PrefetchLink } from "#app/components/prefetch-link.js";
import { formatDateShort, getLocale, t } from "#app/lib/i18n.js";
import type { PaginatedPosts } from "#app/lib/posts.js";

interface PageItem {
  key: string;
  type: "page" | "ellipsis";
  page?: number;
}

const pageNumbers = (current: number, total: number): PageItem[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({
      key: String(i + 1),
      page: i + 1,
      type: "page" as const,
    }));
  }
  const pages = new Set<number>([
    1,
    2,
    current - 1,
    current,
    current + 1,
    total - 1,
    total,
  ]);
  const sorted = [...pages]
    .filter((n) => n >= 1 && n <= total)
    .toSorted((a, b) => a - b);
  const result: PageItem[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (n - prev > 1) {
      result.push({ key: `ellipsis-${prev}`, type: "ellipsis" });
    }
    result.push({ key: String(n), page: n, type: "page" });
    prev = n;
  }
  return result;
};

const about = {
  "en-US":
    "Software engineer based in São Paulo. I write about web development, TypeScript, and software design.",
  "pt-BR":
    "Engenheiro de software em São Paulo. Escrevo sobre desenvolvimento web, TypeScript e design de software.",
} as const;

interface HomeProps {
  data: PaginatedPosts;
  siteUrl: string;
}

export const Home = ({ data, siteUrl }: HomeProps) => {
  const { posts, page, totalPages } = data;
  const locale = getLocale();

  return (
    <>
      <title>Douglas Moura</title>
      <meta
        name="description"
        content="Software engineer writing about web development, TypeScript, and more."
      />
      <link
        rel="canonical"
        href={page === 1 ? siteUrl : `${siteUrl}/page/${page}`}
      />
      {page > 1 && (
        <link
          rel="prev"
          href={page === 2 ? siteUrl : `${siteUrl}/page/${page - 1}`}
        />
      )}
      {page < totalPages && (
        <link rel="next" href={`${siteUrl}/page/${page + 1}`} />
      )}

      <section className="prose mx-auto py-10 px-4">
        {page === 1 && (
          <p className="not-prose text-base text-text-muted mt-0 mb-8 leading-relaxed">
            {about[locale]}
          </p>
        )}

        <div className="not-prose">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="py-2.5 border-b border-border last:border-b-0"
            >
              <h2 className="m-0 text-base font-medium">
                <PrefetchLink
                  href={`/${post.slug}`}
                  className="text-text-strong -tracking-[0.01em] no-underline hover:text-accent motion-safe:transition-colors motion-safe:duration-150"
                >
                  {post.title}
                </PrefetchLink>
              </h2>
              <time
                dateTime={post.created}
                className="block mt-0.5 text-xs text-text-muted tabular-nums"
              >
                {formatDateShort(post.created)}
              </time>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label={t("Pagination")}
            className="not-prose flex items-center justify-center gap-1 px-4 pt-8 mt-4"
          >
            {page > 1 && (
              <PrefetchLink
                href={page === 2 ? "/" : `/page/${page - 1}`}
                rel="prev"
                className="inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-muted hover:text-text-strong hover:bg-surface-1 motion-safe:transition-colors motion-safe:duration-150"
              >
                {t("Previous")}
              </PrefetchLink>
            )}
            {pageNumbers(page, totalPages).map((item) => {
              if (item.type === "ellipsis") {
                return (
                  <span
                    key={item.key}
                    className="hidden sm:inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-muted"
                  >
                    ...
                  </span>
                );
              }
              if (item.page === page) {
                return (
                  <span
                    key={item.key}
                    aria-current="page"
                    className="hidden sm:inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-strong bg-surface-2 font-medium"
                  >
                    {item.page}
                  </span>
                );
              }
              return (
                <PrefetchLink
                  key={item.key}
                  href={item.page === 1 ? "/" : `/page/${item.page}`}
                  className="hidden sm:inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-muted hover:text-text-strong hover:bg-surface-1 motion-safe:transition-colors motion-safe:duration-150"
                >
                  {item.page}
                </PrefetchLink>
              );
            })}
            {page < totalPages && (
              <PrefetchLink
                href={`/page/${page + 1}`}
                rel="next"
                className="inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-muted hover:text-text-strong hover:bg-surface-1 motion-safe:transition-colors motion-safe:duration-150"
              >
                {t("Next")}
              </PrefetchLink>
            )}
          </nav>
        )}
      </section>
    </>
  );
};
