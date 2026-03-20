import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "#app/document.js";
import { setCommonHeaders } from "#app/headers.js";
import { SiteLayout } from "#app/layouts/site-layout.js";
import { generateAtomFeed, generateRssFeed } from "#app/lib/feed.js";
import { buildHowToSchema } from "#app/lib/howto-schema.js";
import { renderMarkdown } from "#app/lib/markdown.js";
import { generateGenericOgImage, generateOgImage } from "#app/lib/og.js";
import type { Post as PostData } from "#app/lib/posts.js";
import {
  getAdjacentPosts,
  getPaginatedPosts,
  getPostAlternates,
  getPostBySlug,
  getPostsByTag,
  getReadingTime,
  resolvePostImages,
  serializePost,
} from "#app/lib/posts.js";
import resume from "#app/lib/resume.json";
import { searchPosts } from "#app/lib/search.js";
import { generateSitemap } from "#app/lib/sitemap.js";
import { fetchTweetData } from "#app/lib/tweets.js";
import type { Theme } from "#app/lib/types.js";
import { About } from "#app/pages/about.js";
import { Home } from "#app/pages/home.js";
import { NotFound } from "#app/pages/not-found.js";
import { Post } from "#app/pages/post.js";
import { Privacy } from "#app/pages/privacy.js";
import { SearchPage } from "#app/pages/search.js";
import { TagPage } from "#app/pages/tag.js";
import { Talks } from "#app/pages/talks.js";

export type { AppContext, Theme } from "#app/lib/types.js";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

const markdownResponse = (post: PostData): Response =>
  new Response(serializePost(post), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });

interface ResolvedTheme {
  theme: Theme;
  explicit: boolean;
}

const resolveTheme = (request: Request): ResolvedTheme => {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(/theme=(light|dark|system)/);
  if (match) {
    return { explicit: true, theme: match[1] as Theme };
  }
  return { explicit: false, theme: "system" };
};

export default defineApp([
  setCommonHeaders(),
  // Legacy locale-switch redirect (EN): set cookie and redirect to root
  route("/en-US", ({ request }) => {
    const url = new URL(request.url);
    const redirect = url.searchParams.get("redirect");
    const safePath =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/";
    return new Response(null, {
      headers: {
        Location: `${url.origin}${safePath}`,
        "Set-Cookie": "locale=en-US; Path=/; Max-Age=31536000; SameSite=Lax",
      },
      status: 302,
    });
  }),
  // Feeds
  route("/en-US/feed.xml", () => generateAtomFeed("en-US", SITE_URL)),
  route("/en-US/rss.xml", () => generateRssFeed("en-US", SITE_URL)),
  route("/pt-BR/feed.xml", () => generateAtomFeed("pt-BR", SITE_URL)),
  route("/pt-BR/rss.xml", () => generateRssFeed("pt-BR", SITE_URL)),
  route("/sitemap.xml", () => generateSitemap(SITE_URL)),
  route("/resume.json", () => Response.json(resume)),
  route("/feed.xml", () =>
    Response.redirect(`${SITE_URL}/en-US/feed.xml`, 301)
  ),
  route("/rss.xml", () => Response.redirect(`${SITE_URL}/en-US/rss.xml`, 301)),
  // Case-insensitive redirect for /pt-br → /pt-BR
  route("/pt-br", ({ request }) => {
    const url = new URL(request.url);
    return Response.redirect(
      `${SITE_URL}/pt-BR${url.pathname.slice("/pt-br".length)}${url.search}`,
      301
    );
  }),
  route("/api/v1/og", ({ request }) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const title = url.searchParams.get("title");

    if (slug) {
      const post = getPostBySlug(slug);
      if (!post) {
        return new Response("Not Found", { status: 404 });
      }
      return generateOgImage(post, SITE_URL);
    }

    if (title) {
      return generateGenericOgImage(title, SITE_URL);
    }

    return new Response("Missing slug or title parameter", { status: 400 });
  }),
  route("/api/v1/search", async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    if (!q) {
      return Response.json({ count: 0, results: [] });
    }
    const locale =
      url.searchParams.get("locale") === "pt-BR" ? "pt-BR" : "en-US";
    const limit = Math.min(Number(url.searchParams.get("limit")) || 10, 50);
    const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
    const data = await searchPosts(q, locale, limit, offset);
    return Response.json(data);
  }),
  // Legacy post redirects: /en-US/:slug → /:slug, /pt-BR/:slug → /:slug
  route("/en-US/:slug", ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) {
      return new Response("Not Found", { status: 404 });
    }
    return Response.redirect(`${SITE_URL}/${post.slug}`, 301);
  }),
  route("/:slug.md", ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) {
      return new Response("Not Found", { status: 404 });
    }
    return markdownResponse(post);
  }),
  // Middleware: set theme, locale, pathname, and post alternates on context
  ({ request, ctx }) => {
    const resolved = resolveTheme(request);
    (ctx as Record<string, unknown>).theme = resolved.theme;
    (ctx as Record<string, unknown>).themeExplicit = resolved.explicit;

    const { pathname } = new URL(request.url);
    (ctx as Record<string, unknown>).pathname = pathname;

    // Locale is URL-driven: /pt-BR/* is always pt-BR, everything else is en-US
    (ctx as Record<string, unknown>).locale =
      pathname === "/pt-BR" || pathname.startsWith("/pt-BR/")
        ? "pt-BR"
        : "en-US";

    // Blog post: override locale to match the post's locale
    const slug = pathname.replace(/^\//, "");
    const post = slug ? getPostBySlug(slug) : undefined;
    if (post) {
      (ctx as Record<string, unknown>).locale = post.locale;
      (ctx as Record<string, unknown>).alternates = getPostAlternates(
        post.slug
      );
    }
  },
  render(
    Document,
    layout(SiteLayout, [
      // ── EN routes (no prefix) ──
      route("/", () => {
        const data = getPaginatedPosts(1, "en-US");
        if (!data) {
          return <NotFound />;
        }
        return <Home data={data} siteUrl={SITE_URL} />;
      }),
      route("/page/:num", ({ params, response }) => {
        const num = Number(params.num);
        if (num === 1) {
          return Response.redirect(`${SITE_URL}/`, 301);
        }
        const data = getPaginatedPosts(num, "en-US");
        if (!data) {
          response.status = 404;
          return <NotFound />;
        }
        return <Home data={data} siteUrl={SITE_URL} />;
      }),
      route("/about", () => <About />),
      route("/talks", () => <Talks />),
      route("/privacy", () => <Privacy />),
      route("/tag/:tag", ({ params, response }) => {
        const tag = decodeURIComponent(params.tag);
        const data = getPostsByTag(tag, 1, "en-US");
        if (!data) {
          response.status = 404;
          return <NotFound />;
        }
        return <TagPage tag={tag} data={data} siteUrl={SITE_URL} />;
      }),
      route("/tag/:tag/page/:num", ({ params, response }) => {
        const tag = decodeURIComponent(params.tag);
        const num = Number(params.num);
        if (num === 1) {
          return Response.redirect(
            `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
            301
          );
        }
        const data = getPostsByTag(tag, num, "en-US");
        if (!data) {
          response.status = 404;
          return <NotFound />;
        }
        return <TagPage tag={tag} data={data} siteUrl={SITE_URL} />;
      }),

      route("/search", async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q")?.trim() ?? "";
        if (!q) {
          return (
            <SearchPage query="" results={[]} count={0} siteUrl={SITE_URL} />
          );
        }
        const data = await searchPosts(q, "en-US", 20, 0);
        return (
          <SearchPage
            query={q}
            results={data.results}
            count={data.count}
            siteUrl={SITE_URL}
          />
        );
      }),

      // ── PT-BR routes (prefixed) ──
      route("/pt-BR", () => {
        const data = getPaginatedPosts(1, "pt-BR");
        if (!data) {
          return <NotFound />;
        }
        return <Home data={data} siteUrl={SITE_URL} basePath="/pt-BR" />;
      }),
      route("/pt-BR/page/:num", ({ params, response }) => {
        const num = Number(params.num);
        if (num === 1) {
          return Response.redirect(`${SITE_URL}/pt-BR`, 301);
        }
        const data = getPaginatedPosts(num, "pt-BR");
        if (!data) {
          response.status = 404;
          return <NotFound />;
        }
        return <Home data={data} siteUrl={SITE_URL} basePath="/pt-BR" />;
      }),
      route("/pt-BR/about", () => <About basePath="/pt-BR" />),
      route("/pt-BR/talks", () => <Talks basePath="/pt-BR" />),
      route("/pt-BR/privacy", () => <Privacy basePath="/pt-BR" />),
      route("/pt-BR/search", async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q")?.trim() ?? "";
        if (!q) {
          return (
            <SearchPage
              query=""
              results={[]}
              count={0}
              siteUrl={SITE_URL}
              localePrefix="/pt-BR"
            />
          );
        }
        const data = await searchPosts(q, "pt-BR", 20, 0);
        return (
          <SearchPage
            query={q}
            results={data.results}
            count={data.count}
            siteUrl={SITE_URL}
            localePrefix="/pt-BR"
          />
        );
      }),
      route("/pt-BR/tag/:tag", ({ params, response }) => {
        const tag = decodeURIComponent(params.tag);
        const data = getPostsByTag(tag, 1, "pt-BR");
        if (!data) {
          response.status = 404;
          return <NotFound />;
        }
        return (
          <TagPage
            tag={tag}
            data={data}
            siteUrl={SITE_URL}
            localePrefix="/pt-BR"
          />
        );
      }),
      route("/pt-BR/tag/:tag/page/:num", ({ params, response }) => {
        const tag = decodeURIComponent(params.tag);
        const num = Number(params.num);
        if (num === 1) {
          return Response.redirect(
            `${SITE_URL}/pt-BR/tag/${encodeURIComponent(tag)}`,
            301
          );
        }
        const data = getPostsByTag(tag, num, "pt-BR");
        if (!data) {
          response.status = 404;
          return <NotFound />;
        }
        return (
          <TagPage
            tag={tag}
            data={data}
            siteUrl={SITE_URL}
            localePrefix="/pt-BR"
          />
        );
      }),

      // Legacy PT-BR post redirect: /pt-BR/:slug → /:slug (for old bookmarks)
      route("/pt-BR/:slug", ({ params, response }) => {
        const post = getPostBySlug(params.slug);
        if (post) {
          return Response.redirect(`${SITE_URL}/${post.slug}`, 301);
        }
        response.status = 404;
        return <NotFound />;
      }),

      // ── Blog post (catch-all) ──
      route("/:slug", async ({ params, request, response }) => {
        const post = getPostBySlug(params.slug);
        if (!post) {
          response.status = 404;
          return <NotFound />;
        }
        const accept = request.headers.get("Accept") ?? "";
        if (accept.includes("text/markdown")) {
          return markdownResponse(post);
        }
        const rendered = await renderMarkdown(post.body);
        const html = resolvePostImages(rendered.html, post.images);
        const readingTime = getReadingTime(post.body);
        const tweets = await Promise.all(
          rendered.tweetIds.map((id) => fetchTweetData(id))
        );
        const howToSchema = buildHowToSchema(post, SITE_URL);
        const { body: _, images: __, ...postWithoutBody } = post;
        const adjacent = getAdjacentPosts(post.slug, post.locale);
        return (
          <Post
            post={postWithoutBody}
            html={html}
            hasMath={rendered.hasMath}
            adjacent={adjacent}
            readingTime={readingTime}
            tweets={tweets}
            howToSchema={howToSchema}
          />
        );
      }),
    ])
  ),
]);
