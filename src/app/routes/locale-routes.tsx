import { route } from "rwsdk/router";

import {
  getPaginatedPosts,
  getPostsByTag,
  getTagBySlug,
  slugifyTag,
} from "#app/lib/posts.js";
import { searchPosts } from "#app/lib/search.js";
import { About } from "#app/pages/about.js";
import { Bookmarks } from "#app/pages/bookmarks.js";
import { Home } from "#app/pages/home.js";
import { NotFound } from "#app/pages/not-found.js";
import { SearchPage } from "#app/pages/search.js";
import { TagPage } from "#app/pages/tag.js";
import { Talks } from "#app/pages/talks.js";

/** URL path prefix without trailing slash: English uses `""`, Portuguese uses `"/pt-BR"`. */
export type LocalePathPrefix = "" | "/pt-BR";

export interface LocaleRoutesOptions {
  siteUrl: string;
  locale: "en-US" | "pt-BR";
  pathPrefix: LocalePathPrefix;
}

/**
 * Shared route handlers for a single locale (home, static pages, tags, search).
 * Keeps EN and pt-BR behavior in one place so redirects and data loading stay aligned.
 */
export const createLocaleRoutes = ({
  siteUrl,
  locale,
  pathPrefix,
}: LocaleRoutesOptions) => {
  const homeCanonicalUrl =
    pathPrefix === "" ? `${siteUrl}/` : `${siteUrl}${pathPrefix}`;
  const homePath = pathPrefix === "" ? "/" : pathPrefix;
  const pagePath = `${pathPrefix}/page/:num`;
  const tagPath = `${pathPrefix}/tag/:tag`;
  const tagPagePath = `${pathPrefix}/tag/:tag/page/:num`;
  const searchPath = `${pathPrefix}/search`;

  return [
    route(homePath, () => {
      const data = getPaginatedPosts(1, locale);
      if (!data) {
        return <NotFound />;
      }
      return <Home data={data} siteUrl={siteUrl} basePath={pathPrefix} />;
    }),

    route(pagePath, ({ params, response }) => {
      const num = Number(params.num);
      if (num === 1) {
        return Response.redirect(homeCanonicalUrl, 301);
      }
      const data = getPaginatedPosts(num, locale);
      if (!data) {
        response.status = 404;
        return <NotFound />;
      }
      return <Home data={data} siteUrl={siteUrl} basePath={pathPrefix} />;
    }),

    route(`${pathPrefix}/about`, () => <About basePath={pathPrefix} />),
    route(`${pathPrefix}/talks`, () => <Talks basePath={pathPrefix} />),
    route(`${pathPrefix}/bookmarks`, () => <Bookmarks basePath={pathPrefix} />),

    route(tagPath, ({ params, response }) => {
      const rawParam = decodeURIComponent(params.tag);
      const slugged = slugifyTag(rawParam);
      if (rawParam !== slugged) {
        return Response.redirect(`${siteUrl}${pathPrefix}/tag/${slugged}`, 301);
      }
      const tag = getTagBySlug(rawParam) ?? rawParam;
      const data = getPostsByTag(tag, 1, locale);
      if (!data) {
        response.status = 404;
        return <NotFound />;
      }
      return (
        <TagPage
          tag={tag}
          data={data}
          siteUrl={siteUrl}
          localePrefix={pathPrefix}
        />
      );
    }),

    route(tagPagePath, ({ params, response }) => {
      const rawParam = decodeURIComponent(params.tag);
      const slugged = slugifyTag(rawParam);
      if (rawParam !== slugged) {
        return Response.redirect(
          `${siteUrl}${pathPrefix}/tag/${slugged}/page/${params.num}`,
          301
        );
      }
      const tag = getTagBySlug(rawParam) ?? rawParam;
      const num = Number(params.num);
      if (num === 1) {
        return Response.redirect(`${siteUrl}${pathPrefix}/tag/${slugged}`, 301);
      }
      const data = getPostsByTag(tag, num, locale);
      if (!data) {
        response.status = 404;
        return <NotFound />;
      }
      return (
        <TagPage
          tag={tag}
          data={data}
          siteUrl={siteUrl}
          localePrefix={pathPrefix}
        />
      );
    }),

    route(searchPath, async ({ request }) => {
      const url = new URL(request.url);
      const q = url.searchParams.get("q")?.trim() ?? "";
      if (!q) {
        return (
          <SearchPage
            query=""
            count={0}
            results={[]}
            siteUrl={siteUrl}
            localePrefix={pathPrefix}
          />
        );
      }
      const data = await searchPosts(q, locale, 20, 0);
      return (
        <SearchPage
          query={q}
          count={data.count}
          results={data.results}
          siteUrl={siteUrl}
          localePrefix={pathPrefix}
        />
      );
    }),
  ];
};
