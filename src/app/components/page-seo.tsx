import { getLocale } from "#app/lib/i18n.js";

interface PageSeoProps {
  title: string;
  description: string;
  url: string;
  type?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const PageSeo = ({
  title,
  description,
  url,
  type = "website",
  image,
  jsonLd,
}: PageSeoProps) => {
  const locale = getLocale();
  const ogLocale = locale.replace("-", "_");

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <link rel="alternate" hrefLang="en-US" href={url} />
      <link rel="alternate" hrefLang="pt-BR" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content="Douglas Moura" />
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content="1686" />
          <meta property="og:image:height" content="948" />
        </>
      )}

      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@douglasdemoura" />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && (
        <script
          type="application/ld+json"
          /* oxlint-disable-next-line eslint-plugin-react(no-danger) -- safe: serializing our own structured data */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
};
