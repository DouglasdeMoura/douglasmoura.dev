import { Breadcrumbs } from "#app/components/breadcrumbs.js";
import { PageSeo } from "#app/components/page-seo.js";
import { PrefetchLink } from "#app/components/prefetch-link.js";
import { TagLink } from "#app/components/tag-link.js";
import { formatDate, getLocale, t } from "#app/lib/i18n.js";
import { slugifyTag } from "#app/lib/posts.js";
import type { PaginatedPosts } from "#app/lib/posts.js";

interface TagPageProps {
  tag: string;
  data: PaginatedPosts;
  siteUrl: string;
  localePrefix?: string;
}

export const TagPage = ({
  tag,
  data,
  siteUrl,
  localePrefix = "",
}: TagPageProps) => {
  const { posts, page, totalPages } = data;
  const locale = getLocale();
  const tagPath = `/tag/${slugifyTag(tag)}`;
  const basePath = `${localePrefix}${tagPath}`;
  const canonicalUrl =
    page === 1 ? `${siteUrl}${basePath}` : `${siteUrl}${basePath}/page/${page}`;
  const title = `${t("Posts tagged")} \u201C${tag}\u201D | Douglas Moura`;
  const baseDescription =
    locale === "pt-BR"
      ? `Artigos e tutoriais sobre ${tag}. Guias práticos de desenvolvimento web, TypeScript, React e engenharia de software por Douglas Moura.`
      : `Articles and tutorials about ${tag}. Practical guides on web development, TypeScript, React, and software engineering by Douglas Moura.`;
  const description =
    page > 1 ? `${baseDescription} — ${t("Page")} ${page}` : baseDescription;
  const ogImageUrl = `${siteUrl}/api/v1/og?title=${encodeURIComponent(`${t("Posts tagged")} "${tag}"`)}`;

  const enTagBase =
    page === 1 ? `${siteUrl}${tagPath}` : `${siteUrl}${tagPath}/page/${page}`;
  const ptTagBase =
    page === 1
      ? `${siteUrl}/pt-BR${tagPath}`
      : `${siteUrl}/pt-BR${tagPath}/page/${page}`;
  const alternates = [
    { href: enTagBase, hrefLang: "en-US" },
    { href: ptTagBase, hrefLang: "pt-BR" },
    { href: enTagBase, hrefLang: "x-default" },
  ];

  return (
    <>
      <PageSeo
        title={title}
        description={description}
        url={canonicalUrl}
        image={ogImageUrl}
        alternates={alternates}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              item: siteUrl,
              name: "Home",
              position: 1,
            },
            {
              "@type": "ListItem",
              item: canonicalUrl,
              name: `Tag: ${tag}`,
              position: 2,
            },
          ],
        }}
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

      <section className="prose mx-auto py-10">
        <Breadcrumbs
          items={[
            { href: localePrefix || "/", label: t("Home") },
            { label: `${t("Posts tagged")} \u201C${tag}\u201D` },
          ]}
          className="px-4"
        />
        <header className="not-prose mb-8 px-4">
          <h1 className="text-text-strong text-2xl font-bold tracking-tight">
            {t("Posts tagged")} &ldquo;{tag}&rdquo;
          </h1>
        </header>

        <div className="not-prose divide-border divide-y">
          {posts.map((post) => (
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

        {totalPages > 1 && (
          <nav
            aria-label={t("Pagination")}
            className="not-prose mt-4 flex items-center justify-center gap-1 px-4 pt-8"
          >
            {page > 1 && (
              <PrefetchLink
                href={page === 2 ? basePath : `${basePath}/page/${page - 1}`}
                rel="prev"
                className="text-text-muted hover:text-text-strong hover:bg-surface-1 inline-flex h-11 min-w-11 items-center justify-center rounded-md px-2 text-sm motion-safe:transition-colors motion-safe:duration-150"
              >
                {t("Previous")}
              </PrefetchLink>
            )}
            {page < totalPages && (
              <PrefetchLink
                href={`${basePath}/page/${page + 1}`}
                rel="next"
                className="text-text-muted hover:text-text-strong hover:bg-surface-1 inline-flex h-11 min-w-11 items-center justify-center rounded-md px-2 text-sm motion-safe:transition-colors motion-safe:duration-150"
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
