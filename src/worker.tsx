import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "#app/document.js";
import { setCommonHeaders } from "#app/headers.js";
import { getPostBySlug } from "#app/lib/posts.js";
import { Home } from "#app/pages/home.js";
import { PostPage } from "#app/pages/post.js";

// biome-ignore lint/complexity/noBannedTypes: scaffold placeholder
export type AppContext = Record<string, never>;

export default defineApp([
  setCommonHeaders(),
  render(Document, [
    route("/", Home),
    route("/:slug", ({ params }) => {
      const post = getPostBySlug(params.slug);
      if (!post) {
        return new Response("Not Found", { status: 404 });
      }
      return <PostPage post={post} />;
    }),
  ]),
]);
