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
      <Header theme={theme} locale={locale} alternates={alternates} />
      <main>{children}</main>
    </>
  );
};
