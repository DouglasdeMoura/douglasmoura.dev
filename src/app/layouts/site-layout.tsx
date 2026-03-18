import { Bookmarks as BookmarksIcon } from "@phosphor-icons/react/dist/ssr/Bookmarks";
import { GithubLogo as GithubIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo as LinkedinIcon } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { RssSimple as RssIcon } from "@phosphor-icons/react/dist/ssr/RssSimple";
import { XLogo as XIcon } from "@phosphor-icons/react/dist/ssr/XLogo";

import { Header } from "#app/components/header.js";
import { getLocaleHref } from "#app/components/locale-link.js";
import { LocaleSwitch } from "#app/components/locale-switch.js";
import { ThemeToggle } from "#app/components/theme-toggle.js";
import { t } from "#app/lib/i18n.js";
import type { AppContext } from "#app/lib/types.js";

export const SiteLayout = ({
  children,
  requestInfo,
}: {
  children?: React.ReactNode;
  requestInfo?: { ctx: unknown };
}) => {
  const appCtx = (requestInfo?.ctx ?? {}) as AppContext;
  const theme = appCtx.theme ?? "system";
  const locale = appCtx.locale ?? "en-US";
  const alternates = appCtx.alternates ?? [];

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-0 left-0 z-50 -translate-y-full focus:translate-y-0 border-b-2 border-r-2 border-accent bg-surface-0 px-5 py-2.5 text-xs font-medium tracking-widest uppercase text-text-strong no-underline shadow-md motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] rounded-br-md outline-none not-focus:invisible"
      >
        {t("Skip to content")}
      </a>
      <Header locale={locale} alternates={alternates} />
      <main id="main-content">{children}</main>
      <footer className="mt-8 border-t border-border">
        <div className="max-w-prose mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <nav className="flex items-center gap-1">
              <a
                href="https://github.com/douglasdemoura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center size-8 rounded-full text-text-muted hover:text-text-strong hover:bg-surface-2 motion-safe:transition-[background-color,color] motion-safe:duration-150"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href="https://linkedin.com/in/dougmoura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center size-8 rounded-full text-text-muted hover:text-text-strong hover:bg-surface-2 motion-safe:transition-[background-color,color] motion-safe:duration-150"
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href="https://x.com/douglasdemoura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="inline-flex items-center justify-center size-8 rounded-full text-text-muted hover:text-text-strong hover:bg-surface-2 motion-safe:transition-[background-color,color] motion-safe:duration-150"
              >
                <XIcon size={18} />
              </a>
              <a
                href="/bookmarks"
                aria-label={t("Bookmarks")}
                className="inline-flex items-center justify-center size-8 rounded-full text-text-muted hover:text-text-strong hover:bg-surface-2 motion-safe:transition-[background-color,color] motion-safe:duration-150"
              >
                <BookmarksIcon size={18} />
              </a>
              <a
                href={`/${locale}/feed.xml`}
                aria-label="RSS"
                className="inline-flex items-center justify-center size-8 rounded-full text-text-muted hover:text-text-strong hover:bg-surface-2 motion-safe:transition-[background-color,color] motion-safe:duration-150"
              >
                <RssIcon size={18} />
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <LocaleSwitch
                href={getLocaleHref(locale, alternates)}
                currentLocale={locale}
                label={t("Switch language")}
              />
              <ThemeToggle initialTheme={theme} label={t("Theme")} />
            </div>
          </div>
          <p className="mt-6 text-center sm:text-left text-xs text-text-muted/60 flex items-center gap-2">
            <img
              src="https://github.com/douglasdemoura.png"
              alt="Douglas Moura"
              className="rounded-full h-4 w-4"
            />{" "}
            <span>Douglas Moura</span>
          </p>
        </div>
      </footer>
    </>
  );
};
