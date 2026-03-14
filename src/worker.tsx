import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "#app/document.js";
import { setCommonHeaders } from "#app/headers.js";
import { Home } from "#app/pages/home.js";

// biome-ignore lint/complexity/noBannedTypes: scaffold placeholder
export type AppContext = Record<string, never>;

export default defineApp([
  setCommonHeaders(),
  render(Document, [route("/", Home)]),
]);
