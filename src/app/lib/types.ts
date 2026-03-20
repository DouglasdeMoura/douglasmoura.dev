import type { PostAlternate } from "#app/lib/posts.js";

export type Theme = "light" | "dark" | "system";

export interface AppContext {
  locale?: "en-US" | "pt-BR";
  theme?: Theme;
  themeExplicit?: boolean;
  alternates?: PostAlternate[];
  pathname?: string;
}
