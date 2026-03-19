import { getAllPosts, getPostAlternates } from "#app/lib/posts.js";
import type { PostAlternate } from "#app/lib/posts.js";

const escapeXml = (str: string): string =>
  str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&apos;")
    .replaceAll('"', "&quot;");

const alternateLinks = (
  siteUrl: string,
  slug: string,
  locale: string,
  alternates: PostAlternate[]
): string => {
  const self = `    <xhtml:link rel="alternate" hreflang="${locale}" href="${siteUrl}/${escapeXml(slug)}" />`;
  const alts = alternates.map(
    (alt) =>
      `    <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${siteUrl}/${escapeXml(alt.slug)}" />`
  );
  return [self, ...alts].join("\n");
};

export const generateSitemap = (siteUrl: string): Response => {
  const staticPages = [
    { loc: "/", priority: "1.0" },
    { loc: "/about", priority: "0.8" },
    { loc: "/talks", priority: "0.7" },
  ];

  const posts = getAllPosts().toSorted(
    (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
  );

  const staticEntries = staticPages.map(
    ({ loc, priority }) => `  <url>
    <loc>${siteUrl}${loc}</loc>
    <priority>${priority}</priority>
  </url>`
  );

  const postEntries = posts.map((post) => {
    const alternates = getPostAlternates(post.slug);
    const hasAlternates = alternates.length > 0;
    const lastmod = post.updated || post.created;

    return `  <url>
    <loc>${siteUrl}/${escapeXml(post.slug)}</loc>
    <lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${hasAlternates ? `\n${alternateLinks(siteUrl, post.slug, post.locale, alternates)}` : ""}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticEntries, ...postEntries].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
