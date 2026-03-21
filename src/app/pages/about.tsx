import { GithubLogo as GithubIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo as LinkedinIcon } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { XLogo as XIcon } from "@phosphor-icons/react/dist/ssr/XLogo";

import { PageSeo } from "#app/components/page-seo.js";
import { getLocale, t } from "#app/lib/i18n.js";
import { SITE_URL } from "#app/lib/site.js";

const bio = {
  "en-US": [
    "Hey, I'm Douglas — a software engineer in São Paulo.",
    "I didn't start in tech. I studied civil engineering, graduated, managed construction sites, and somewhere along the way realized I'd rather build software than buildings. I co-founded Konkreta, a platform for ordering concrete (yes, actual concrete), and started an engineering blog called Engenharia Livre that grew to 40k+ followers.",
    "Since making the switch, I've spent the last 6+ years working across the stack — design systems, banking apps, an iron ore auction platform for the Chinese market, AI agents, and healthcare software. I've worked at places like Avanade, Trela, and Caylent, and I currently build healthcare solutions at Jaya Tech.",
    "I also help organize NodeBR, a community for Brazilian developers, and I enjoy giving talks at conferences when I get the chance.",
    "Here I write about web development, TypeScript, and the things I learn along the way.",
  ],
  "pt-BR": [
    "Oi, eu sou o Douglas — engenheiro de software em São Paulo.",
    "Eu não comecei na tecnologia. Estudei engenharia civil, me formei, gerenciei obras, e em algum momento percebi que preferia construir software do que prédios. Co-fundei a Konkreta, uma plataforma de pedidos de concreto (sim, concreto de verdade), e criei o Engenharia Livre, um blog de engenharia que chegou a mais de 40 mil seguidores.",
    "Desde a transição, passei os últimos 6+ anos trabalhando em todo o stack — design systems, aplicativos bancários, uma plataforma de leilão de minério de ferro para o mercado chinês, agentes de IA e software de saúde. Já trabalhei em empresas como Avanade, Trela e Caylent, e atualmente construo soluções de saúde na Jaya Tech.",
    "Também ajudo a organizar o NodeBR, uma comunidade para desenvolvedores brasileiros, e gosto de palestrar em conferências quando tenho a oportunidade.",
    "Aqui escrevo sobre desenvolvimento web, TypeScript e as coisas que aprendo no caminho.",
  ],
} as const;

interface AboutProps {
  basePath?: string;
}

export const About = ({ basePath = "" }: AboutProps) => {
  const locale = getLocale();
  const canonicalUrl = `${SITE_URL}${basePath}/about`;
  const title = `${t("About")} | Douglas Moura`;
  const ogImageUrl = `${SITE_URL}/api/v1/og?title=${encodeURIComponent(t("About"))}`;

  const alternates = [
    { href: `${SITE_URL}/about`, hrefLang: "en-US" },
    { href: `${SITE_URL}/pt-BR/about`, hrefLang: "pt-BR" },
    { href: `${SITE_URL}/about`, hrefLang: "x-default" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    description: bio[locale][0],
    jobTitle: "Software Engineer",
    name: "Douglas Moura",
    sameAs: [
      "https://github.com/douglasdemoura",
      "https://linkedin.com/in/dougmoura",
      "https://x.com/douglasdemoura",
    ],
    url: SITE_URL,
  };

  return (
    <>
      <PageSeo
        title={title}
        description={t(
          "Douglas Moura is a software engineer in São Paulo. Building design systems, banking apps, AI agents, and healthcare solutions."
        )}
        url={canonicalUrl}
        type="profile"
        image={ogImageUrl}
        jsonLd={jsonLd}
        alternates={alternates}
      />

      <section className="prose mx-auto py-10 px-4">
        <div className="not-prose">
          <h1 className="text-4xl font-bold tracking-tight text-text-strong">
            {t("About")}
          </h1>

          <div className="mt-8 space-y-4 text-text leading-relaxed">
            {bio[locale].map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://github.com/douglasdemoura"
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted no-underline hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
            >
              <GithubIcon size={18} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/dougmoura"
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted no-underline hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
            >
              <LinkedinIcon size={18} />
              LinkedIn
            </a>
            <a
              href="https://x.com/douglasdemoura"
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted no-underline hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
            >
              <XIcon size={18} />
              @douglasdemoura
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
