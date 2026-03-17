import { Header } from "#app/components/header.js";
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
        className="absolute -left-[9999px] z-[999] px-4 py-2 bg-accent text-white text-sm no-underline rounded-br-md focus:left-0 focus:top-0"
      >
        Skip to content
      </a>
      <Header theme={theme} locale={locale} alternates={alternates} />
      <main id="main-content">{children}</main>
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-text-muted max-w-prose mx-auto">
        <p>&copy; {new Date().getFullYear()} Douglas Moura</p>
      </footer>
    </>
  );
};
