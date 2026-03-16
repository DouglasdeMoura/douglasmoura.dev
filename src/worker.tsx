import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "#app/document.js";
import { setCommonHeaders } from "#app/headers.js";
import { generateOgImage } from "#app/lib/og.js";
import type { Post as PostData } from "#app/lib/posts.js";
import { getPostBySlug, serializePost } from "#app/lib/posts.js";
import { searchPosts } from "#app/lib/search.js";
import { Home } from "#app/pages/home.js";
import { Post } from "#app/pages/post.js";

export interface AppContext {
  locale?: "en-US" | "pt-BR";
}

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

const markdownResponse = (post: PostData): Response =>
  new Response(serializePost(post), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });

export default defineApp([
  setCommonHeaders(),
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
  route("/:locale/:slug", ({ params }) => {
    if (params.locale !== "en-US" && params.locale !== "pt-BR") {
      return new Response("Not Found", { status: 404 });
    }
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
  render(Document, [
    route("/", Home),
    route("/:slug", ({ params, request, ctx }) => {
      const post = getPostBySlug(params.slug);
      if (!post) {
        return new Response("Not Found", { status: 404 });
      }
      const accept = request.headers.get("Accept") ?? "";
      if (accept.includes("text/markdown")) {
        return markdownResponse(post);
      }
      (ctx as Record<string, unknown>).locale = post.locale;
      return <Post post={post} />;
    }),
  ]),
]);
