import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";

import { LocaleToggle } from "#app/components/locale-toggle.js";
import { ThemeToggle } from "#app/components/theme-toggle.js";
import { t } from "#app/lib/i18n.js";
import type { PostAlternate } from "#app/lib/posts.js";

const GRAVATAR_URL =
  "https://www.gravatar.com/avatar/997c72f0b7ca0fc26bdf60ca27cb4194?s=96";

interface HeaderProps {
  theme: "light" | "dark" | "system";
  locale: "en-US" | "pt-BR";
  alternates: PostAlternate[];
}

export const Header = ({ theme, locale, alternates }: HeaderProps) => (
  <header className="site-header flex items-center justify-between px-6 py-4 max-w-prose mx-auto">
    <a href="/" aria-label="Home">
      <img
        src={GRAVATAR_URL}
        alt="Douglas Moura"
        width={40}
        height={40}
        decoding="async"
        className="rounded-full"
      />
    </a>
    <nav className="flex items-center gap-4 sm:gap-6">
      <a
        href="/about"
        className="inline-flex items-center justify-center min-h-11 text-sm text-text-muted hover:text-text-strong"
      >
        {t("About")}
      </a>
      <a
        href="/"
        className="inline-flex items-center justify-center min-h-11 text-sm text-text-muted hover:text-text-strong"
      >
        {t("Posts")}
      </a>
      <a
        href="/archive"
        className="inline-flex items-center justify-center min-h-11 text-sm text-text-muted hover:text-text-strong"
      >
        {t("Archive")}
      </a>
      <a
        href="/search"
        aria-label={t("Search")}
        className="inline-flex items-center justify-center min-w-11 min-h-11 text-text-muted hover:text-text-strong"
      >
        <MagnifyingGlassIcon size={18} weight="bold" />
      </a>
      <ThemeToggle initialTheme={theme} label={t("Theme")} />
      <LocaleToggle
        initialLocale={locale}
        label={t("Language")}
        alternates={alternates}
      />
    </nav>
  </header>
);
