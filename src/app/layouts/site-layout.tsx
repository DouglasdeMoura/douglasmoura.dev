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
      <footer className="mt-16 border-t border-border">
        <div className="max-w-prose mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              <a
                href="https://github.com/douglasdemoura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/dougmoura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
              >
                LinkedIn
              </a>
              <a
                href="/bookmarks"
                className="text-text-muted hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
              >
                {t("Bookmarks")}
              </a>
              <a
                href={`/${locale}/feed.xml`}
                className="text-text-muted hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
              >
                RSS
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
          <p className="mt-6 text-center sm:text-left text-xs text-text-muted/60">
            &copy; {new Date().getFullYear()} Douglas Moura
          </p>
        </div>
      </footer>
    </>
  );
};
