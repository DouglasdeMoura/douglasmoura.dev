import { ArrowSquareOut as LinkIcon } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { Presentation as SlidesIcon } from "@phosphor-icons/react/dist/ssr/Presentation";
import { VideoCamera as VideoIcon } from "@phosphor-icons/react/dist/ssr/VideoCamera";

import { PageSeo } from "#app/components/page-seo.js";
import { formatDate, t } from "#app/lib/i18n.js";
import resume from "#app/lib/resume.json";
import { SITE_URL } from "#app/lib/site.js";

interface Talk {
  name: string;
  entity: string;
  startDate: string;
  location: { name: string; country: string };
  slides?: string;
  url?: string;
  recording?: string;
}

const buildEventJsonLd = (talks: Talk[]) =>
  talks.map((talk) => {
    const event: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Event",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: talk.location.country,
          addressLocality: talk.location.name,
        },
        name: talk.location.name,
      },
      name: `${talk.name} @ ${talk.entity}`,
      organizer: {
        "@type": "Organization",
        name: talk.entity,
      },
      performer: {
        "@type": "Person",
        name: "Douglas Moura",
        url: "https://douglasmoura.dev",
      },
      startDate: talk.startDate,
    };

    if (talk.url) {
      event.url = talk.url;
    }

    if (talk.recording) {
      event.recordedIn = {
        "@type": "VideoObject",
        url: talk.recording,
      };
    }

    return event;
  });

interface TalksProps {
  basePath?: string;
}

export const Talks = ({ basePath = "" }: TalksProps) => {
  const talks = resume.projects.filter(
    (p): p is typeof p & Talk => p.type === "talk"
  ) as Talk[];
  const eventJsonLd = buildEventJsonLd(talks);

  const grouped = new Map<string, Talk[]>();
  for (const talk of talks) {
    const year = new Date(talk.startDate).getFullYear().toString();
    const list = grouped.get(year) ?? [];
    list.push(talk);
    grouped.set(year, list);
  }

  const years = [...grouped.keys()].toSorted((a, b) => Number(b) - Number(a));

  const canonicalUrl = `${SITE_URL}${basePath}/talks`;
  const title = `${t("Talks")} | Douglas Moura`;
  const description = t(
    "Conference talks and presentations by Douglas Moura on web development, TypeScript, React, and software engineering at events across Brazil."
  );
  const ogImageUrl = `${SITE_URL}/api/v1/og?title=${encodeURIComponent(t("Talks"))}`;

  const alternates = [
    { href: `${SITE_URL}/talks`, hrefLang: "en-US" },
    { href: `${SITE_URL}/pt-BR/talks`, hrefLang: "pt-BR" },
    { href: `${SITE_URL}/talks`, hrefLang: "x-default" },
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
      <script
        type="application/ld+json"
        /* oxlint-disable-next-line react/no-danger -- safe: serializing our own structured data */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <section className="prose mx-auto px-4 py-10">
        <div className="not-prose">
          <h1 className="text-text-strong text-4xl font-bold tracking-tight">
            {t("Talks")}
          </h1>

          {years.map((year) => (
            <div key={year} className="mt-10 first:mt-8">
              <h2 className="text-text-strong text-xl font-semibold">{year}</h2>

              <div className="border-border relative mt-4 ml-3 border-l-2 pl-6">
                {grouped.get(year)?.map((talk, i, arr) => (
                  <div
                    key={`${talk.startDate}-${talk.entity}`}
                    className={`relative ${i < arr.length - 1 ? "pb-8" : ""}`}
                  >
                    {/* Timeline dot — offset accounts for pl-6 + border-l-2/2 + dot/2 */}
                    <div className="bg-accent ring-surface-0 absolute top-[5px] -left-[calc(1.5rem+6px)] size-2.5 rounded-full ring-[3px]" />

                    <h3 className="text-text-strong text-base leading-snug font-medium">
                      {talk.name}
                    </h3>
                    <p className="text-text-muted mt-1 text-sm">
                      {talk.entity}
                    </p>
                    <time
                      dateTime={talk.startDate}
                      className="text-text-muted mt-0.5 block text-sm tracking-wide"
                    >
                      {formatDate(talk.startDate)}
                    </time>

                    {(talk.slides || talk.url || talk.recording) && (
                      <div className="mt-2.5 flex flex-wrap gap-3">
                        {talk.slides && (
                          <a
                            href={talk.slides}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted bg-surface-1 hover:bg-surface-2 hover:text-text-strong inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs tracking-[0.04em] no-underline active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
                          >
                            <SlidesIcon size={13} />
                            {t("Slides")}
                          </a>
                        )}
                        {talk.recording && (
                          <a
                            href={talk.recording}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted bg-surface-1 hover:bg-surface-2 hover:text-text-strong inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs tracking-[0.04em] no-underline active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
                          >
                            <VideoIcon size={13} />
                            {t("Recording")}
                          </a>
                        )}
                        {talk.url && (
                          <a
                            href={talk.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted bg-surface-1 hover:bg-surface-2 hover:text-text-strong inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs tracking-[0.04em] no-underline active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
                          >
                            <LinkIcon size={13} />
                            {t("Event")}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
