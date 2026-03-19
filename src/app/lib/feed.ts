import { Feed } from "feed";

import { renderMarkdown } from "#app/lib/markdown.js";
import { getAllPosts, resolvePostImages } from "#app/lib/posts.js";
import type { Post } from "#app/lib/posts.js";

type Locale = "en-US" | "pt-BR";

const FEED_CACHE = new Map<string, { xml: string; expires: number }>();
/** 1 hour in ms */
const CACHE_TTL = 3_600_000;

const AUTHOR = {
  email: "hello@douglasmoura.dev",
  link: "https://douglasmoura.dev",
  name: "Douglas Moura",
};

const LOCALE_META: Record<
  Locale,
  { description: string; path: string; title: string }
> = {
  "en-US": {
    description: "Articles on web development, TypeScript, React, and more.",
    path: "/en-US",
    title: "Douglas Moura",
  },
  "pt-BR": {
    description: "Artigos sobre desenvolvimento web, TypeScript, React e mais.",
    path: "/pt-BR",
    title: "Douglas Moura",
  },
};

const getPostsByLocale = (locale: Locale): Post[] =>
  getAllPosts()
    .filter((p) => p.locale === locale)
    .toSorted(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );

const buildFeed = async (locale: Locale, siteUrl: string): Promise<Feed> => {
  const meta = LOCALE_META[locale];
  const altLocale: Locale = locale === "en-US" ? "pt-BR" : "en-US";
  const altMeta = LOCALE_META[altLocale];

  const feed = new Feed({
    author: AUTHOR,
    copyright: `© ${new Date().getFullYear()} ${AUTHOR.name}`,
    description: meta.description,
    favicon: `${siteUrl}/favicon.ico`,
    feedLinks: {
      atom: `${siteUrl}${meta.path}/feed.xml`,
      rss: `${siteUrl}${meta.path}/rss.xml`,
    },
    id: `${siteUrl}${meta.path}/`,
    language: locale,
    link: siteUrl,
    title: meta.title,
    updated: new Date(),
  });

  feed.addExtension({
    name: "_custom",
    objects: {
      "atom:link": {
        _attributes: {
          href: `${siteUrl}${altMeta.path}/feed.xml`,
          hreflang: altLocale,
          rel: "alternate",
          type: "application/atom+xml",
        },
      },
    },
  });

  const posts = getPostsByLocale(locale);

  for (const post of posts) {
    const rendered = await renderMarkdown(post.body);
    const html = resolvePostImages(rendered.html, post.images);
    const postUrl = `${siteUrl}/${post.slug}`;

    feed.addItem({
      author: [AUTHOR],
      category: post.tags.map((tag) => ({ name: tag })),
      content: html,
      date: new Date(post.created),
      description: post.description,
      id: postUrl,
      link: postUrl,
      published: new Date(post.created),
      title: post.title,
      ...(post.cover
        ? {
            image: post.cover.startsWith("http")
              ? post.cover
              : `${siteUrl}${post.cover}`,
          }
        : {}),
    });
  }

  return feed;
};

const FEED_HEADERS_ATOM = {
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
  "Content-Type": "application/atom+xml; charset=utf-8",
};

const FEED_HEADERS_RSS = {
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
  "Content-Type": "application/rss+xml; charset=utf-8",
};

const getCached = async (
  key: string,
  generate: () => Promise<string>
): Promise<string> => {
  const cached = FEED_CACHE.get(key);
  if (cached && Date.now() < cached.expires) {
    return cached.xml;
  }
  const xml = await generate();
  FEED_CACHE.set(key, { expires: Date.now() + CACHE_TTL, xml });
  return xml;
};

export const generateAtomFeed = async (
  locale: Locale,
  siteUrl: string
): Promise<Response> => {
  const xml = await getCached(`atom-${locale}`, async () => {
    const feed = await buildFeed(locale, siteUrl);
    return feed.atom1();
  });
  return new Response(xml, { headers: FEED_HEADERS_ATOM });
};

export const generateRssFeed = async (
  locale: Locale,
  siteUrl: string
): Promise<Response> => {
  const xml = await getCached(`rss-${locale}`, async () => {
    const feed = await buildFeed(locale, siteUrl);
    return feed.rss2();
  });
  return new Response(xml, { headers: FEED_HEADERS_RSS });
};
