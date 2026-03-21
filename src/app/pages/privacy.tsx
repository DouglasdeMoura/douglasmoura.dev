import { PageSeo } from "#app/components/page-seo.js";
import { getLocale, t } from "#app/lib/i18n.js";
import { SITE_URL } from "#app/lib/site.js";

const content = {
  "en-US": {
    analyticsBody:
      "This site uses Cloudflare Web Analytics, a privacy-first analytics service that does not use cookies, does not track individual visitors, and does not collect personal data. It only measures aggregate page views and performance metrics.",
    analyticsTitle: "Analytics",
    contactBody:
      "If you have any questions about this policy, you can reach me at",
    contactTitle: "Contact",
    cookiesBody:
      "This site does not set any tracking cookies. A theme preference may be stored in your browser's local storage so your chosen color scheme persists between visits.",
    cookiesTitle: "Cookies",
    intro:
      "This site is a personal blog. I respect your privacy and keep data collection to a minimum.",
    thirdPartyBody:
      "Some posts embed content from third-party services such as CodePen, StackBlitz, or YouTube. These embeds may set their own cookies and are governed by their respective privacy policies.",
    thirdPartyTitle: "Third-party content",
  },
  "pt-BR": {
    analyticsBody:
      "Este site utiliza o Cloudflare Web Analytics, um serviço de analytics que prioriza a privacidade, não utiliza cookies, não rastreia visitantes individuais e não coleta dados pessoais. Ele mede apenas visualizações de página e métricas de desempenho de forma agregada.",
    analyticsTitle: "Analytics",
    contactBody:
      "Se você tiver alguma dúvida sobre esta política, entre em contato pelo e-mail",
    contactTitle: "Contato",
    cookiesBody:
      "Este site não define cookies de rastreamento. Uma preferência de tema pode ser armazenada no armazenamento local do seu navegador para que o esquema de cores escolhido persista entre visitas.",
    cookiesTitle: "Cookies",
    intro:
      "Este site é um blog pessoal. Eu respeito sua privacidade e mantenho a coleta de dados ao mínimo.",
    thirdPartyBody:
      "Alguns posts incorporam conteúdo de serviços de terceiros como CodePen, StackBlitz ou YouTube. Esses conteúdos incorporados podem definir seus próprios cookies e são regidos por suas respectivas políticas de privacidade.",
    thirdPartyTitle: "Conteúdo de terceiros",
  },
} as const;

interface PrivacyProps {
  basePath?: string;
}

export const Privacy = ({ basePath = "" }: PrivacyProps) => {
  const locale = getLocale();
  const c = content[locale];
  const canonicalUrl = `${SITE_URL}${basePath}/privacy`;
  const title = `${t("Privacy Policy")} | Douglas Moura`;
  const description = t(
    "Privacy policy for douglasmoura.dev — a personal blog with minimal data collection and no tracking cookies."
  );
  const ogImageUrl = `${SITE_URL}/api/v1/og?title=${encodeURIComponent(t("Privacy Policy"))}`;

  const alternates = [
    { href: `${SITE_URL}/privacy`, hrefLang: "en-US" },
    { href: `${SITE_URL}/pt-BR/privacy`, hrefLang: "pt-BR" },
    { href: `${SITE_URL}/privacy`, hrefLang: "x-default" },
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
            {t("Privacy Policy")}
          </h1>

          <p className="mt-6 text-text leading-relaxed">{c.intro}</p>

          <h2 className="mt-8 text-xl font-semibold text-text-strong">
            {c.analyticsTitle}
          </h2>
          <p className="mt-3 text-text leading-relaxed">{c.analyticsBody}</p>

          <h2 className="mt-8 text-xl font-semibold text-text-strong">
            {c.cookiesTitle}
          </h2>
          <p className="mt-3 text-text leading-relaxed">{c.cookiesBody}</p>

          <h2 className="mt-8 text-xl font-semibold text-text-strong">
            {c.thirdPartyTitle}
          </h2>
          <p className="mt-3 text-text leading-relaxed">{c.thirdPartyBody}</p>

          <h2 className="mt-8 text-xl font-semibold text-text-strong">
            {c.contactTitle}
          </h2>
          <p className="mt-3 text-text leading-relaxed">
            {c.contactBody}{" "}
            <a
              href="mailto:douglas.ademoura@gmail.com"
              className="text-accent hover:text-accent-hover underline underline-offset-2 motion-safe:transition-colors motion-safe:duration-150"
            >
              douglas.ademoura@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
};
