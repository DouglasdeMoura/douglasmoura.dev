import { GithubLogo as GithubIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo as LinkedinIcon } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";

import { getLocale, t } from "#app/lib/i18n.js";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

const bio = {
  "en-US": [
    "Software engineer based in São Paulo with 6+ years of experience shipping design systems, banking apps, auction platforms, AI agents, and healthcare software for enterprise clients.",
    "Started in civil engineering — graduated, managed construction projects — then made the leap to software. Co-founded Konkreta, Brazil's main concrete ordering platform. Founded Engenharia Livre, an engineering blog with 40k+ followers.",
    "Currently building healthcare solutions at Jaya Tech. Previously built LLM-powered products and AI agents at Caylent on AWS.",
    "I write about web development, TypeScript, and software design.",
  ],
  "pt-BR": [
    "Engenheiro de software em São Paulo com mais de 6 anos de experiência entregando design systems, aplicativos bancários, plataformas de leilão, agentes de IA e software de saúde para clientes corporativos.",
    "Comecei na engenharia civil — me formei, gerenciei obras — e depois migrei para software. Co-fundei a Konkreta, a principal plataforma de pedidos de concreto do Brasil. Fundei o Engenharia Livre, um blog de engenharia com mais de 40 mil seguidores.",
    "Atualmente construindo soluções de saúde na Jaya Tech. Anteriormente, construí produtos com LLM e agentes de IA na Caylent na AWS.",
    "Escrevo sobre desenvolvimento web, TypeScript e design de software.",
  ],
} as const;

export const About = () => {
  const locale = getLocale();

  return (
    <>
      <title>{t("About")} — Douglas Moura</title>
      <meta name="description" content={bio[locale][0]} />
      <link rel="canonical" href={`${SITE_URL}/about`} />

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
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted no-underline hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
            >
              <GithubIcon size={18} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/dougmoura"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted no-underline hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
            >
              <LinkedinIcon size={18} />
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
