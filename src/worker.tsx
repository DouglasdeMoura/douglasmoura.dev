import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/home";

// biome-ignore lint/complexity/noBannedTypes: scaffold placeholder
export type AppContext = Record<string, never>;

export default defineApp([
  setCommonHeaders(),
  render(Document, [route("/", Home)]),
]);
