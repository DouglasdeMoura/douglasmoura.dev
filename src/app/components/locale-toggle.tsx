"use client";

import { useCallback, useState } from "react";

import { setLocale } from "#app/lib/locale-action.js";

interface LocaleToggleProps {
  initialLocale: "en-US" | "pt-BR";
  label: string;
}

export const LocaleToggle = ({ initialLocale, label }: LocaleToggleProps) => {
  const [locale, setLocaleState] = useState(initialLocale);

  const toggle = useCallback(async () => {
    const next = locale === "en-US" ? "pt-BR" : "en-US";
    setLocaleState(next);
    await setLocale(next);
    window.location.href = "/";
  }, [locale]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${label}: ${locale === "en-US" ? "English" : "Português"}`}
      className="text-sm text-text-muted hover:text-text-strong"
    >
      {locale === "en-US" ? "PT" : "EN"}
    </button>
  );
};
