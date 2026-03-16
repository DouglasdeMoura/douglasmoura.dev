import { LocaleToggle } from "#app/components/locale-toggle.js";
import { formatDate } from "#app/lib/i18n.js";
import type { PaginatedPosts } from "#app/lib/posts.js";

interface HomeProps {
  data: PaginatedPosts;
  siteUrl: string;
  locale: "en-US" | "pt-BR";
}

export const Home = ({ data, siteUrl, locale }: HomeProps) => {
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

      <LocaleToggle initialLocale={locale} />

      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <article>
              <h2>
                <a href={`/${post.slug}`}>{post.title}</a>
              </h2>
              <time dateTime={post.created}>{formatDate(post.created)}</time>
              <p>{post.description}</p>
              {post.tags.length > 0 && (
                <ul>
                  {post.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav aria-label="Pagination">
          {page > 1 && (
            <a href={page === 2 ? "/" : `/page/${page - 1}`} rel="prev">
              Previous
            </a>
          )}
          {page < totalPages && (
            <a href={`/page/${page + 1}`} rel="next">
              Next
            </a>
          )}
        </nav>
      )}
    </>
  );
};
