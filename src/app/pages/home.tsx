import { formatDate, t } from "#app/lib/i18n.js";
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

interface HomeProps {
  data: PaginatedPosts;
  siteUrl: string;
}

export const Home = ({ data, siteUrl }: HomeProps) => {
  const { posts, page, totalPages } = data;

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
        <div className="not-prose">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className={
                index === 0
                  ? "rounded-xl border border-border bg-surface-0 p-5 shadow-sm dark:shadow-none mb-10"
                  : "py-5 border-b border-border last:border-b-0"
              }
            >
              {index === 0 && post.cover && (
                <img
                  src={post.cover}
                  alt=""
                  className="w-full rounded-lg mb-5 aspect-[2/1] object-cover shadow-md"
                  decoding="async"
                />
              )}
              <h2 className={`mt-0 ${index === 0 ? "text-3xl" : "text-xl"}`}>
                <a
                  href={`/${post.slug}`}
                  className="text-text-strong font-semibold -tracking-[0.01em] no-underline hover:text-accent motion-safe:transition-colors motion-safe:duration-150"
                >
                  {post.title}
                </a>
              </h2>
              <time
                dateTime={post.created}
                className="mt-1 block text-sm text-text-muted tracking-wide"
              >
                {formatDate(post.created)}
              </time>
              <p className="mt-2 mb-0 text-text-muted leading-relaxed">
                {post.description}
              </p>
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <a
                      key={tag}
                      href={`/tag/${encodeURIComponent(tag)}`}
                      className="inline-block lowercase text-xs tracking-[0.04em] text-text-muted bg-surface-1 py-1 px-2.5 rounded-full no-underline hover:bg-surface-2 hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label={t("Pagination")}
            className="not-prose flex items-center justify-center gap-1 px-4 pt-8 mt-4"
          >
            {page > 1 && (
              <a
                href={page === 2 ? "/" : `/page/${page - 1}`}
                rel="prev"
                className="inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-muted hover:text-text-strong hover:bg-surface-1 motion-safe:transition-colors motion-safe:duration-150"
              >
                {t("Previous")}
              </a>
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
                <a
                  key={item.key}
                  href={item.page === 1 ? "/" : `/page/${item.page}`}
                  className="hidden sm:inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-muted hover:text-text-strong hover:bg-surface-1 motion-safe:transition-colors motion-safe:duration-150"
                >
                  {item.page}
                </a>
              );
            })}
            {page < totalPages && (
              <a
                href={`/page/${page + 1}`}
                rel="next"
                className="inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-muted hover:text-text-strong hover:bg-surface-1 motion-safe:transition-colors motion-safe:duration-150"
              >
                {t("Next")}
              </a>
            )}
          </nav>
        )}
      </section>
    </>
  );
};
