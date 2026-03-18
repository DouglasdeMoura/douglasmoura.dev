import { formatDate, t } from "#app/lib/i18n.js";
import type { PaginatedPosts } from "#app/lib/posts.js";

interface TagPageProps {
  tag: string;
  data: PaginatedPosts;
  siteUrl: string;
}

export const TagPage = ({ tag, data, siteUrl }: TagPageProps) => {
  const { posts, page, totalPages } = data;
  const basePath = `/tag/${encodeURIComponent(tag)}`;

  return (
    <>
      <title>
        {t("Posts tagged")} &ldquo;{tag}&rdquo; — Douglas Moura
      </title>
      <meta
        name="description"
        content={`${t("Posts tagged")} "${tag}" — Douglas Moura`}
      />
      <link
        rel="canonical"
        href={
          page === 1
            ? `${siteUrl}${basePath}`
            : `${siteUrl}${basePath}/page/${page}`
        }
      />
      {page > 1 && (
        <link
          rel="prev"
          href={
            page === 2
              ? `${siteUrl}${basePath}`
              : `${siteUrl}${basePath}/page/${page - 1}`
          }
        />
      )}
      {page < totalPages && (
        <link rel="next" href={`${siteUrl}${basePath}/page/${page + 1}`} />
      )}
      {posts.slice(0, 3).map((post) => (
        <link
          key={`prefetch-${post.slug}`}
          rel="x-prefetch"
          href={`/${post.slug}`}
        />
      ))}
      {page > 1 && (
        <link
          rel="x-prefetch"
          href={page === 2 ? basePath : `${basePath}/page/${page - 1}`}
        />
      )}
      {page < totalPages && (
        <link rel="x-prefetch" href={`${basePath}/page/${page + 1}`} />
      )}

      <section className="prose mx-auto py-10">
        <header className="not-prose mb-8 px-4">
          <h1 className="text-2xl font-bold tracking-tight text-text-strong">
            {t("Posts tagged")} &ldquo;{tag}&rdquo;
          </h1>
        </header>

        <div className="not-prose divide-y divide-border">
          {posts.map((post) => (
            <article key={post.slug} className="py-5 px-4 first:pt-0">
              <h2 className="mt-0 text-xl">
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
                  {post.tags.map((tagName) => (
                    <a
                      key={tagName}
                      href={`/tag/${encodeURIComponent(tagName)}`}
                      className="inline-block lowercase text-xs tracking-[0.04em] text-text-muted bg-surface-1 py-1 px-2.5 rounded-full no-underline hover:bg-surface-2 hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
                    >
                      {tagName}
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
                href={page === 2 ? basePath : `${basePath}/page/${page - 1}`}
                rel="prev"
                className="inline-flex items-center justify-center min-w-11 h-11 px-2 text-sm rounded-md text-text-muted hover:text-text-strong hover:bg-surface-1 motion-safe:transition-colors motion-safe:duration-150"
              >
                {t("Previous")}
              </a>
            )}
            {page < totalPages && (
              <a
                href={`${basePath}/page/${page + 1}`}
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
