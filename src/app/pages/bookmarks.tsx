import { PageSeo } from "#app/components/page-seo.js";
import { t } from "#app/lib/i18n.js";
import { SITE_URL } from "#app/lib/site.js";

interface BookmarksProps {
  basePath?: string;
}

export const Bookmarks = ({ basePath = "" }: BookmarksProps) => {
  const canonicalUrl = `${SITE_URL}${basePath}/bookmarks`;
  const title = `${t("Bookmarks")} | Douglas Moura`;
  const description = t(
    "A curated collection of links and resources on web development, software engineering, and design."
  );
  const ogImageUrl = `${SITE_URL}/api/v1/og?title=${encodeURIComponent(t("Bookmarks"))}`;

  const alternates = [
    { href: `${SITE_URL}/bookmarks`, hrefLang: "en-US" },
    { href: `${SITE_URL}/pt-BR/bookmarks`, hrefLang: "pt-BR" },
    { href: `${SITE_URL}/bookmarks`, hrefLang: "x-default" },
  ];

  return (
    <>
      <PageSeo
        title={title}
        description={description}
        url={canonicalUrl}
        image={ogImageUrl}
        alternates={alternates}
      />

      <section className="prose mx-auto py-10 px-4">
        <div className="not-prose">
          <h1 className="text-4xl font-bold tracking-tight text-text-strong">
            {t("Bookmarks")}
          </h1>
          <p className="mt-4 text-text-muted">{t("Coming soon.")}</p>
        </div>
      </section>
    </>
  );
};
