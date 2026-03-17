import { t } from "#app/lib/i18n.js";

export const NotFound = () => (
  <section className="prose dark:prose-invert mx-auto px-6 py-16 text-center">
    <h1 className="text-6xl font-bold tracking-tight text-text-strong">404</h1>
    <p className="text-lg text-text-muted">{t("Page not found")}</p>
    <a
      href="/"
      className="mt-4 inline-block text-accent hover:text-accent-hover"
    >
      {t("Back to home")}
    </a>
  </section>
);
