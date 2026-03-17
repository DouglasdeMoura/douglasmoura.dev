import { Header } from "#app/components/header.js";
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
  const themeExplicit = appCtx.themeExplicit ?? false;
  const locale = appCtx.locale ?? "en-US";
  const alternates = appCtx.alternates ?? [];

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-0 left-0 z-50 -translate-y-full focus:translate-y-0 border-b-2 border-r-2 border-accent bg-surface-0 px-5 py-2.5 text-xs font-medium tracking-widest uppercase text-text-strong no-underline shadow-md motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] rounded-br-md outline-none"
      >
        {t("Skip to content")}
      </a>
      <Header
        theme={theme}
        themeExplicit={themeExplicit}
        locale={locale}
        alternates={alternates}
      />
      <main id="main-content">{children}</main>
      <footer className="border-t border-border px-4 pt-6 pb-8 max-w-prose mx-auto">
        <nav className="flex items-center justify-center gap-6 text-sm text-text-muted mb-4">
          <a
            href="https://github.com/douglasdemoura"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/dougmoura"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="/bookmarks">{t("Bookmarks")}</a>
          <a href={`/${locale}/feed.xml`}>RSS</a>
        </nav>
        <p className="text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Douglas Moura
        </p>
      </footer>
    </>
  );
};
