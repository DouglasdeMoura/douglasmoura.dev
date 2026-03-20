import type { Post, PostAlternate } from "#app/lib/posts.js";

export const PostSeo = ({
  post,
  siteUrl,
  alternates,
}: {
  post: Omit<Post, "body" | "images">;
  siteUrl: string;
  alternates: PostAlternate[];
}) => {
  const canonicalUrl = `${siteUrl}/${post.slug}`;
  const ogLocale = post.locale.replace("-", "_");
  const absoluteImage = post.cover ? `${siteUrl}${post.cover}` : "";
  const ogImageUrl = `${siteUrl}/api/v1/og?slug=${encodeURIComponent(post.slug)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      author: { "@type": "Person", name: "Douglas Moura", url: siteUrl },
      datePublished: post.created,
      ...(post.updated && { dateModified: post.updated }),
      description: post.description,
      headline: post.title,
      ...(absoluteImage && { image: absoluteImage }),
      inLanguage: post.locale,
      ...(post.tags.length > 0 && { keywords: post.tags.join(", ") }),
      mainEntityOfPage: { "@id": canonicalUrl, "@type": "WebPage" },
      publisher: { "@type": "Person", name: "Douglas Moura" },
    },
    {
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
          name: post.title,
          position: 2,
        },
      ],
    },
  ];

  return (
    <>
      <title>{`${post.title} | Douglas Moura`}</title>
      <meta name="description" content={post.description} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" type="text/markdown" href={`${canonicalUrl}.md`} />
      <link rel="alternate" hrefLang={post.locale} href={canonicalUrl} />
      {alternates.map((alt) => (
        <link
          key={alt.locale}
          rel="alternate"
          hrefLang={alt.locale}
          href={`${siteUrl}/${alt.slug}`}
        />
      ))}
      {alternates.length > 0 && (
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      )}

      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content="Douglas Moura" />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1686" />
      <meta property="og:image:height" content="948" />

      <meta property="article:published_time" content={post.created} />
      {post.updated && (
        <meta property="article:modified_time" content={post.updated} />
      )}
      <meta property="article:author" content={`${siteUrl}/about`} />
      {post.tags.map((tag) => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:creator" content="@douglasdemoura" />
      <meta name="twitter:image" content={ogImageUrl} />

      <script
        type="application/ld+json"
        /* oxlint-disable-next-line eslint-plugin-react(no-danger) -- safe: serializing our own structured data */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};
