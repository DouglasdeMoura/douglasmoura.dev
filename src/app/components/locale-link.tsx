import type { PostAlternate } from "#app/lib/posts.js";
import { localePathPrefix } from "#app/lib/site.js";

/**
 * Returns the URL for switching to the other locale.
 *
 * For blog posts with alternates, links to the alternate slug.
 * For static pages, toggles the /pt-BR prefix.
 */
export const getLocaleHref = (
  locale: "en-US" | "pt-BR",
  alternates: PostAlternate[],
  pathname?: string
): string => {
  const targetLocale = locale === "en-US" ? "pt-BR" : "en-US";

  // Blog posts with known alternates
  const alt = alternates.find((a) => a.locale === targetLocale);
  if (alt) {
    return `/${alt.slug}`;
  }

  // Static pages: toggle the /pt-BR prefix
  if (pathname) {
    if (targetLocale === "pt-BR") {
      return `${localePathPrefix("pt-BR")}${pathname === "/" ? "" : pathname}`;
    }
    // PT-BR → EN: strip /pt-BR prefix
    const stripped = pathname.replace(/^\/pt-BR\/?/, "/");
    return stripped || "/";
  }

  return localePathPrefix(targetLocale) || "/";
};
