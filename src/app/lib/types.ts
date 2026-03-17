export type Theme = "light" | "dark" | "system";

export interface AppContext {
  locale?: "en-US" | "pt-BR";
  theme?: Theme;
}
