import {
  getAllPosts,
  getPostAlternates,
  getTagsByLocale,
} from "#app/lib/posts.js";
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
  const enSlug =
    locale === "en-US"
      ? slug
      : (alternates.find((a) => a.locale === "en-US")?.slug ?? slug);
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/${escapeXml(enSlug)}" />`;
  return [self, ...alts, xDefault].join("\n");
};

/** Build hreflang links for a pair of EN/PT-BR static page URLs. */
const staticAlternateLinks = (
  siteUrl: string,
  enPath: string,
  ptPath: string
): string =>
  [
    `    <xhtml:link rel="alternate" hreflang="en-US" href="${siteUrl}${enPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${siteUrl}${ptPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${enPath}" />`,
  ].join("\n");

interface TagLocaleInfo {
  enTags: Map<string, number>;
  ptTags: Map<string, number>;
  tagLastmod: Map<string, Map<string, string>>;
}

const tagHreflangs = (
  siteUrl: string,
  enPath: string,
  ptPath: string,
  hasEn: boolean,
  hasPt: boolean
): string => {
  if (hasEn && hasPt) {
    return staticAlternateLinks(siteUrl, enPath, ptPath);
  }
  if (hasEn) {
    return `    <xhtml:link rel="alternate" hreflang="en-US" href="${siteUrl}${enPath}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${enPath}" />`;
  }
  return `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${siteUrl}${ptPath}" />`;
};

const buildTagEntries = (
  siteUrl: string,
  { enTags, ptTags, tagLastmod }: TagLocaleInfo
): string[] => {
  const allTagNames = new Set([...enTags.keys(), ...ptTags.keys()]);
  const entries: string[] = [];

  for (const tag of [...allTagNames].toSorted()) {
    const encodedTag = escapeXml(encodeURIComponent(tag));
    const enPath = `/tag/${encodedTag}`;
    const ptPath = `/pt-BR/tag/${encodedTag}`;
    const hasEn = enTags.has(tag);
    const hasPt = ptTags.has(tag);
    const hreflangs = tagHreflangs(siteUrl, enPath, ptPath, hasEn, hasPt);

    if (hasEn) {
      const lastmod = tagLastmod.get(tag)?.get("en-US");
      const lastmodStr = lastmod
        ? new Date(lastmod).toISOString().split("T")[0]
        : undefined;
      entries.push(`  <url>
    <loc>${siteUrl}${enPath}</loc>${lastmodStr ? `\n    <lastmod>${lastmodStr}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
${hreflangs}
  </url>`);
    }

    if (hasPt) {
      const lastmod = tagLastmod.get(tag)?.get("pt-BR");
      const lastmodStr = lastmod
        ? new Date(lastmod).toISOString().split("T")[0]
        : undefined;
      entries.push(`  <url>
    <loc>${siteUrl}${ptPath}</loc>${lastmodStr ? `\n    <lastmod>${lastmodStr}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
${hreflangs}
  </url>`);
    }
  }

  return entries;
};

export const generateSitemap = (siteUrl: string): Response => {
  const posts = getAllPosts().toSorted(
    (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
  );

  const latestPostDate =
    posts.length > 0
      ? new Date(posts[0].updated || posts[0].created)
          .toISOString()
          .split("T")[0]
      : new Date().toISOString().split("T")[0];

  // Static page pairs: EN path ↔ PT-BR path
  const staticPagePairs = [
    { enPath: "/", lastmod: latestPostDate, priority: "1.0", ptPath: "/pt-BR" },
    {
      enPath: "/about",
      lastmod: latestPostDate,
      priority: "0.8",
      ptPath: "/pt-BR/about",
    },
    {
      enPath: "/talks",
      lastmod: latestPostDate,
      priority: "0.7",
      ptPath: "/pt-BR/talks",
    },
    {
      enPath: "/privacy",
      lastmod: latestPostDate,
      priority: "0.3",
      ptPath: "/pt-BR/privacy",
    },
  ];

  const staticEntries: string[] = [];
  for (const { enPath, ptPath, lastmod, priority } of staticPagePairs) {
    const hreflangs = staticAlternateLinks(siteUrl, enPath, ptPath);
    // EN entry
    staticEntries.push(`  <url>
    <loc>${siteUrl}${enPath}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <priority>${priority}</priority>
${hreflangs}
  </url>`);
    // PT-BR entry
    staticEntries.push(`  <url>
    <loc>${siteUrl}${ptPath}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <priority>${priority}</priority>
${hreflangs}
  </url>`);
  }

  const tagLastmod = new Map<string, Map<string, string>>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const postDate = post.updated || post.created;
      let localeMap = tagLastmod.get(tag);
      if (!localeMap) {
        localeMap = new Map();
        tagLastmod.set(tag, localeMap);
      }
      const existing = localeMap.get(post.locale);
      if (!existing || postDate > existing) {
        localeMap.set(post.locale, postDate);
      }
    }
  }

  const tagEntries = buildTagEntries(siteUrl, {
    enTags: getTagsByLocale("en-US"),
    ptTags: getTagsByLocale("pt-BR"),
    tagLastmod,
  });

  const postEntries = posts.map((post) => {
    const alternates = getPostAlternates(post.slug);
    const lastmod = post.updated || post.created;
    const hreflangs =
      alternates.length > 0
        ? alternateLinks(siteUrl, post.slug, post.locale, alternates)
        : `    <xhtml:link rel="alternate" hreflang="${post.locale}" href="${siteUrl}/${escapeXml(post.slug)}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/${escapeXml(post.slug)}" />`;

    return `  <url>
    <loc>${siteUrl}/${escapeXml(post.slug)}</loc>
    <lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
${hreflangs}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticEntries, ...tagEntries, ...postEntries].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
