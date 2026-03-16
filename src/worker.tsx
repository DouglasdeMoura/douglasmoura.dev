import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "#app/document.js";
import { setCommonHeaders } from "#app/headers.js";
import { generateOgImage } from "#app/lib/og.js";
import { getPostBySlug } from "#app/lib/posts.js";
import { Home } from "#app/pages/home.js";
import { Post } from "#app/pages/post.js";

// biome-ignore lint/complexity/noBannedTypes: scaffold placeholder
export type AppContext = Record<string, never>;

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

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
  render(Document, [
    route("/", Home),
    route("/:slug", ({ params }) => {
      const post = getPostBySlug(params.slug);
      if (!post) {
        return new Response("Not Found", { status: 404 });
      }
      return <Post post={post} />;
    }),
  ]),
]);
