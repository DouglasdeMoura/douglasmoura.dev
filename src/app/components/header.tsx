import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";

import { LocaleToggle } from "#app/components/locale-toggle.js";
import { ThemeToggle } from "#app/components/theme-toggle.js";
import { t } from "#app/lib/i18n.js";
import type { PostAlternate } from "#app/lib/posts.js";

const GRAVATAR_URL =
  "https://www.gravatar.com/avatar/997c72f0b7ca0fc26bdf60ca27cb4194?s=128";

interface HeaderProps {
  theme: "light" | "dark" | "system";
  locale: "en-US" | "pt-BR";
  alternates: PostAlternate[];
}

export const Header = ({ theme, locale, alternates }: HeaderProps) => (
  <header className="flex items-center justify-between border-b border-border px-6 py-4 max-w-prose mx-auto">
    <a
      href="/"
      aria-label="Home"
      className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150"
    >
      <img
        src={GRAVATAR_URL}
        alt="Douglas Moura"
        width={48}
        height={48}
        decoding="async"
        className="rounded-full ring-2 ring-accent"
      />
      <span className="hidden sm:inline text-sm font-medium text-text-strong">
        Douglas Moura
      </span>
    </a>
    <nav className="flex items-center gap-4 sm:gap-6">
      <a
        href="/about"
        className="inline-flex items-center justify-center min-h-11 text-sm text-text-muted hover:text-text-strong transition-colors duration-150"
      >
        {t("About")}
      </a>
      <a
        href="/"
        className="inline-flex items-center justify-center min-h-11 text-sm text-text-muted hover:text-text-strong transition-colors duration-150"
      >
        {t("Posts")}
      </a>
      <a
        href="/archive"
        className="inline-flex items-center justify-center min-h-11 text-sm text-text-muted hover:text-text-strong transition-colors duration-150"
      >
        {t("Archive")}
      </a>
      <a
        href="/search"
        aria-label={t("Search")}
        className="inline-flex items-center justify-center min-w-11 min-h-11 text-text-muted hover:text-text-strong transition-colors duration-150"
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
