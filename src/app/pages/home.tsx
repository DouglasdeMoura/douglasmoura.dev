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
    "Hey, I'm Douglas — a software engineer in São Paulo. Here I write about web development, TypeScript, and the things I learn along the way.",
  "pt-BR":
    "Oi, eu sou o Douglas — engenheiro de software em São Paulo. Aqui escrevo sobre desenvolvimento web, TypeScript e as coisas que aprendo no caminho.",
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
        content={`${t("Software engineer writing about web development, TypeScript, and more.")}`}
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
          <p className="not-prose text-lg text-text -tracking-[0.01em] mt-0 mb-8 leading-relaxed">
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
            className="not-prose flex items-center justify-between sm:justify-center gap-4 pt-6 text-sm"
          >
            {page > 1 && (
              <PrefetchLink
                href={page === 2 ? "/" : `/page/${page - 1}`}
                rel="prev"
                aria-label={t("Previous")}
                className="inline-flex items-center justify-center size-11 sm:size-auto -ml-3 sm:ml-0 text-text-muted hover:text-accent motion-safe:transition-colors motion-safe:duration-150"
              >
                <span aria-hidden="true">&#8592;</span>
              </PrefetchLink>
            )}
            {pageNumbers(page, totalPages).map((item) => {
              if (item.type === "ellipsis") {
                return (
                  <span
                    key={item.key}
                    className="hidden sm:inline text-text-muted"
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
                    className="hidden sm:inline text-text-strong font-medium"
                  >
                    {item.page}
                  </span>
                );
              }
              return (
                <PrefetchLink
                  key={item.key}
                  href={item.page === 1 ? "/" : `/page/${item.page}`}
                  className="hidden sm:inline text-text-muted hover:text-accent motion-safe:transition-colors motion-safe:duration-150"
                >
                  {item.page}
                </PrefetchLink>
              );
            })}
            {page < totalPages && (
              <PrefetchLink
                href={`/page/${page + 1}`}
                rel="next"
                aria-label={t("Next")}
                className="inline-flex items-center justify-center size-11 sm:size-auto ml-auto sm:ml-0 -mr-3 sm:mr-0 text-text-muted hover:text-accent motion-safe:transition-colors motion-safe:duration-150"
              >
                <span aria-hidden="true">&#8594;</span>
              </PrefetchLink>
            )}
          </nav>
        )}
      </section>
    </>
  );
};
