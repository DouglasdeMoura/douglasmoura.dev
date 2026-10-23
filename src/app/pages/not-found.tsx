import { t } from "#app/lib/i18n.js";

export const NotFound = () => (
  <>
    <title>{`${t("Page not found")} | Douglas Moura`}</title>
    <meta name="robots" content="noindex" />
    <section className="mx-auto max-w-prose px-4 py-24 text-center">
      <p className="text-border text-8xl font-bold tracking-tighter select-none">
        404
      </p>
      <h1 className="text-text-strong mt-4 text-xl font-semibold">
        {t("Page not found")}
      </h1>
      <p className="text-text-muted mt-2">
        {t("The page you're looking for doesn't exist or has been moved.")}
      </p>
      <a
        href="/"
        className="text-accent hover:text-accent-hover decoration-border hover:decoration-accent-hover mt-6 inline-block underline decoration-1 underline-offset-[3px] motion-safe:transition-colors motion-safe:duration-150"
      >
        {t("Back to home")}
      </a>
    </section>
  </>
);
