import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "#app/document.js";
import { setCommonHeaders } from "#app/headers.js";
import { SiteLayout } from "#app/layouts/site-layout.js";
import { generateAtomFeed, generateRssFeed } from "#app/lib/feed.js";
import { renderMarkdown } from "#app/lib/markdown.js";
import { generateOgImage } from "#app/lib/og.js";
import type { Post as PostData } from "#app/lib/posts.js";
import {
  getAdjacentPosts,
  getPaginatedPosts,
  getPostAlternates,
  getPostBySlug,
  getPostsByTag,
  resolvePostImages,
  serializePost,
} from "#app/lib/posts.js";
import resume from "#app/lib/resume.json";
import { searchPosts } from "#app/lib/search.js";
import type { Theme } from "#app/lib/types.js";
import { About } from "#app/pages/about.js";
import { Home } from "#app/pages/home.js";
import { NotFound } from "#app/pages/not-found.js";
import { Post } from "#app/pages/post.js";
import { TagPage } from "#app/pages/tag.js";
import { Talks } from "#app/pages/talks.js";

export type { AppContext, Theme } from "#app/lib/types.js";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

const markdownResponse = (post: PostData): Response =>
  new Response(serializePost(post), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });

const resolveLocale = (request: Request): "en-US" | "pt-BR" => {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(/locale=(en-US|pt-BR)/);
  if (match) {
    return match[1] as "en-US" | "pt-BR";
  }
  const accept = request.headers.get("Accept-Language") ?? "";
  if (/pt/i.test(accept)) {
    return "pt-BR";
  }
  return "en-US";
};

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
  route("/pt-BR", ({ request }) => {
    const url = new URL(request.url);
    const redirect = url.searchParams.get("redirect");
    const safePath =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/";
    return new Response(null, {
      headers: {
        Location: `${url.origin}${safePath}`,
        "Set-Cookie": "locale=pt-BR; Path=/; Max-Age=31536000; SameSite=Lax",
      },
      status: 302,
    });
  }),
  route("/en-US/feed.xml", () => generateAtomFeed("en-US", SITE_URL)),
  route("/en-US/rss.xml", () => generateRssFeed("en-US", SITE_URL)),
  route("/pt-BR/feed.xml", () => generateAtomFeed("pt-BR", SITE_URL)),
  route("/pt-BR/rss.xml", () => generateRssFeed("pt-BR", SITE_URL)),
  route("/resume.json", () => Response.json(resume)),
  route("/feed.xml", () =>
    Response.redirect(`${SITE_URL}/en-US/feed.xml`, 301)
  ),
  route("/rss.xml", () => Response.redirect(`${SITE_URL}/en-US/rss.xml`, 301)),
  route("/api/v1/og", ({ request }) => {
    const slug = new URL(request.url).searchParams.get("slug");
    if (!slug) {
      return new Response("Missing slug parameter", { status: 400 });
    }
    const post = getPostBySlug(slug);
    if (!post) {
      return new Response("Not Found", { status: 404 });
    }
    return generateOgImage(post, SITE_URL);
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
  route("/en-US/:slug", ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) {
      return new Response("Not Found", { status: 404 });
    }
    return Response.redirect(`${SITE_URL}/${post.slug}`, 301);
  }),
  route("/pt-BR/:slug", ({ params }) => {
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
  ({ request, ctx }) => {
    const resolved = resolveTheme(request);
    (ctx as Record<string, unknown>).theme = resolved.theme;
    (ctx as Record<string, unknown>).themeExplicit = resolved.explicit;
    (ctx as Record<string, unknown>).locale = resolveLocale(request);
    const slug = new URL(request.url).pathname.slice(1);
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
      route("/", ({ ctx }) => {
        const locale = (ctx as Record<string, unknown>).locale as
          | "en-US"
          | "pt-BR";
        const data = getPaginatedPosts(1, locale);
        if (!data) {
          return <NotFound />;
        }
        return <Home data={data} siteUrl={SITE_URL} />;
      }),
      route("/page/:num", ({ params, ctx }) => {
        const num = Number(params.num);
        if (num === 1) {
          return Response.redirect(`${SITE_URL}/`, 301);
        }
        const locale = (ctx as Record<string, unknown>).locale as
          | "en-US"
          | "pt-BR";
        const data = getPaginatedPosts(num, locale);
        if (!data) {
          return <NotFound />;
        }
        return <Home data={data} siteUrl={SITE_URL} />;
      }),
      route("/about", () => <About />),
      route("/talks", () => <Talks />),
      route("/tag/:tag", ({ params, ctx }) => {
        const tag = decodeURIComponent(params.tag);
        const locale = (ctx as Record<string, unknown>).locale as
          | "en-US"
          | "pt-BR";
        const data = getPostsByTag(tag, 1, locale);
        if (!data) {
          return <NotFound />;
        }
        return <TagPage tag={tag} data={data} siteUrl={SITE_URL} />;
      }),
      route("/tag/:tag/page/:num", ({ params, ctx }) => {
        const tag = decodeURIComponent(params.tag);
        const num = Number(params.num);
        if (num === 1) {
          return Response.redirect(
            `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
            301
          );
        }
        const locale = (ctx as Record<string, unknown>).locale as
          | "en-US"
          | "pt-BR";
        const data = getPostsByTag(tag, num, locale);
        if (!data) {
          return <NotFound />;
        }
        return <TagPage tag={tag} data={data} siteUrl={SITE_URL} />;
      }),
      route("/:slug", async ({ params, request }) => {
        const post = getPostBySlug(params.slug);
        if (!post) {
          return <NotFound />;
        }
        const accept = request.headers.get("Accept") ?? "";
        if (accept.includes("text/markdown")) {
          return markdownResponse(post);
        }
        const rawHtml = await renderMarkdown(post.body);
        const html = resolvePostImages(rawHtml, post.images);
        const { body: _, images: __, ...postWithoutBody } = post;
        const adjacent = getAdjacentPosts(post.slug, post.locale);
        return <Post post={postWithoutBody} html={html} adjacent={adjacent} />;
      }),
    ])
  ),
]);
