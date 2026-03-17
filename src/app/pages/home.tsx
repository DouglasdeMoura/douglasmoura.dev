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

      <section className="prose dark:prose-invert mx-auto px-6 py-8">
        <div className="not-prose space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="post-card">
              <h2 className="text-xl font-semibold tracking-tight">
                <a href={`/${post.slug}`}>{post.title}</a>
              </h2>
              <time
                dateTime={post.created}
                className="text-sm text-text-muted tracking-wide"
              >
                {formatDate(post.created)}
              </time>
              <p className="mt-1.5 text-text-muted leading-relaxed">
                {post.description}
              </p>
              {post.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav aria-label={t("Pagination")} className="not-prose pagination">
            {page > 1 && (
              <a href={page === 2 ? "/" : `/page/${page - 1}`} rel="prev">
                {t("Previous")}
              </a>
            )}
            {pageNumbers(page, totalPages).map((item) => {
              if (item.type === "ellipsis") {
                return (
                  <span key={item.key} className="hidden sm:inline-flex">
                    ...
                  </span>
                );
              }
              if (item.page === page) {
                return (
                  <span
                    key={item.key}
                    aria-current="page"
                    className="hidden sm:inline-flex"
                  >
                    {item.page}
                  </span>
                );
              }
              return (
                <a
                  key={item.key}
                  href={item.page === 1 ? "/" : `/page/${item.page}`}
                  className="hidden sm:inline-flex"
                >
                  {item.page}
                </a>
              );
            })}
            {page < totalPages && (
              <a href={`/page/${page + 1}`} rel="next">
                {t("Next")}
              </a>
            )}
          </nav>
        )}
      </section>
    </>
  );
};
