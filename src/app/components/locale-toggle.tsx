"use client";

import { useCallback, useState } from "react";

import { setLocale } from "#app/lib/locale-action.js";

export const LocaleToggle = ({
  initialLocale,
}: {
  initialLocale: "en-US" | "pt-BR";
}) => {
  const [locale, setLocaleState] = useState(initialLocale);

  const toggle = useCallback(async () => {
    const next = locale === "en-US" ? "pt-BR" : "en-US";
    setLocaleState(next);
    await setLocale(next);
    window.location.href = "/";
  }, [locale]);

  return (
    <button type="button" onClick={toggle} aria-label="Toggle language">
      {locale === "en-US" ? "PT-BR" : "EN"}
    </button>
  );
};
