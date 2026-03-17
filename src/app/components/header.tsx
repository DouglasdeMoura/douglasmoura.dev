import { ThemeToggle } from "#app/components/theme-toggle.js";
import { t } from "#app/lib/i18n.js";

const GRAVATAR_URL =
  "https://www.gravatar.com/avatar/997c72f0b7ca0fc26bdf60ca27cb4194?s=96";

interface HeaderProps {
  theme: "light" | "dark" | "system";
}

export const Header = ({ theme }: HeaderProps) => (
  <header className="flex items-center justify-between px-6 py-4 max-w-prose mx-auto">
    <a href="/" aria-label="Home">
      <img
        src={GRAVATAR_URL}
        alt="Douglas Moura"
        width={40}
        height={40}
        className="rounded-full"
      />
    </a>
    <nav className="flex items-center gap-6">
      <a
        href="/about"
        className="text-sm text-text-muted hover:text-text-strong"
      >
        {t("About")}
      </a>
      <a href="/" className="text-sm text-text-muted hover:text-text-strong">
        {t("Posts")}
      </a>
      <a
        href="/archive"
        className="text-sm text-text-muted hover:text-text-strong"
      >
        {t("Archive")}
      </a>
      <a
        href="/search"
        className="text-sm text-text-muted hover:text-text-strong"
      >
        {t("Search")}
      </a>
      <ThemeToggle initialTheme={theme} label={t("Theme")} />
    </nav>
  </header>
);
