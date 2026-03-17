"use client";

import { useCallback, useEffect, useState } from "react";

import { ShortcutHint } from "#app/components/shortcut-hint.js";
import { setLocale } from "#app/lib/locale-action.js";

interface PostAlternate {
  locale: "en-US" | "pt-BR";
  slug: string;
}

interface LocaleToggleProps {
  initialLocale: "en-US" | "pt-BR";
  label: string;
  alternates: PostAlternate[];
}

export const LocaleToggle = ({
  initialLocale,
  label,
  alternates,
}: LocaleToggleProps) => {
  const [locale, setLocaleState] = useState(initialLocale);

  const toggle = useCallback(async () => {
    const next = locale === "en-US" ? "pt-BR" : "en-US";
    setLocaleState(next);
    await setLocale(next);

    const alt = alternates.find((a) => a.locale === next);
    window.location.href = alt ? `/${alt.slug}` : "/";
  }, [locale, alternates]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "l") {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${label}: ${locale === "en-US" ? "English" : "Português"}`}
      className="group relative inline-flex items-center justify-center min-w-11 min-h-11 text-sm text-text-muted hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
    >
      {locale === "en-US" ? "PT" : "EN"}
      <ShortcutHint label={label} mac={["⌥", "L"]} other={["Alt", "L"]} />
    </button>
  );
};
