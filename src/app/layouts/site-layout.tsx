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

  return (
    <>
      <Header theme={theme} locale={locale} />
      <main>{children}</main>
    </>
  );
};
