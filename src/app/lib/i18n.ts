import pino from "pino";
import { getRequestInfo } from "rwsdk/worker";

import {
  formatDateShortLocale,
  translate,
  translations,
} from "#app/lib/i18n-messages.js";
import type { Locale, TranslationKey } from "#app/lib/i18n-messages.js";
import type { AppContext } from "#app/lib/types.js";

export type {
  CommandMenuLabels,
  Locale,
  TranslationKey,
} from "#app/lib/i18n-messages.js";

const logger = pino({ name: "i18n" });

/** Read locale from rwsdk request context. Falls back to en-US. */
export const getLocale = (): Locale => {
  try {
    const { ctx } = getRequestInfo();
    return (ctx as AppContext).locale ?? "en-US";
  } catch {
    return "en-US";
  }
};

/**
 * Gettext-style translate. Returns the translation for the current
 * request locale, or the input string itself when none is found.
 */
export const t = (text: TranslationKey | string): string => {
  const locale = getLocale();
  if (locale !== "en-US") {
    const translated = (translations as Record<string, Record<string, string>>)[
      locale
    ]?.[text];
    if (!translated) {
      logger.warn({ key: text, locale }, "Missing translation");
    }
  }
  return translate(locale, text);
};

/** Format a date string using the current request locale. */
export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat(getLocale(), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

/** Short date for compact listings (e.g. "Sep 27, 2024" / "27 set. 2024"). */
export const formatDateShort = (iso: string): string =>
  formatDateShortLocale(getLocale(), iso);
