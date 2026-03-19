import { t } from "#app/lib/i18n.js";

export const NotFound = () => (
  <>
    <title>{`${t("Page not found")} | Douglas Moura`}</title>
    <section className="mx-auto max-w-prose px-4 py-24 text-center">
      <p className="text-8xl font-bold tracking-tighter text-border select-none">
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold text-text-strong">
        {t("Page not found")}
      </h1>
      <p className="mt-2 text-text-muted">
        {t("The page you're looking for doesn't exist or has been moved.")}
      </p>
      <a
        href="/"
        className="mt-6 inline-block text-accent hover:text-accent-hover underline underline-offset-[3px] decoration-1 decoration-border hover:decoration-accent-hover motion-safe:transition-colors motion-safe:duration-150"
      >
        {t("Back to home")}
      </a>
    </section>
  </>
);
