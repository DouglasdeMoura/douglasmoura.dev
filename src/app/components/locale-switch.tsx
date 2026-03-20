"use client";

import { Check as CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { Translate as TranslateIcon } from "@phosphor-icons/react/dist/csr/Translate";
import { useCallback, useEffect, useRef, useState } from "react";

import { Kbd } from "#app/components/kbd.js";

const LOCALE_LABELS: Record<string, string> = {
  "en-US": "English",
  "pt-BR": "Português",
};

interface LocaleSwitchProps {
  href: string;
  currentLocale: "en-US" | "pt-BR";
  label: string;
}

export const LocaleSwitch = ({
  href,
  currentLocale,
  label,
}: LocaleSwitchProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "l") {
        e.preventDefault();
        window.location.href = href;
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [href]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const close = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
  }, []);

  const targetLocale = currentLocale === "en-US" ? "pt-BR" : "en-US";
  const locales = ["en-US", "pt-BR"] as const;

  const getLocaleHref = (loc: string): string | undefined => {
    if (loc === currentLocale) {
      return undefined;
    }
    if (loc === targetLocale) {
      return href;
    }
    return undefined;
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={label}
        className="inline-flex items-center justify-center size-8 rounded-full text-text-muted hover:text-text-strong hover:bg-surface-2 motion-safe:transition-[background-color,color] motion-safe:duration-150"
      >
        <TranslateIcon size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full mb-2 left-0 sm:left-auto sm:right-0 min-w-max rounded-lg border border-border bg-surface-0 py-1 shadow-lg"
        >
          {locales.map((loc) => {
            const isActive = loc === currentLocale;
            return (
              <a
                key={loc}
                role="menuitem"
                href={getLocaleHref(loc)}
                lang={loc}
                hrefLang={loc}
                aria-current={isActive ? "true" : undefined}
                onClick={isActive ? close : undefined}
                className={`flex items-center justify-between gap-3 px-3 py-2 text-sm no-underline ${
                  isActive
                    ? "text-text-strong font-medium"
                    : "text-text-muted hover:text-text-strong hover:bg-surface-1"
                } motion-safe:transition-colors motion-safe:duration-150`}
              >
                {LOCALE_LABELS[loc]}
                {isActive && <CheckIcon size={16} className="shrink-0" />}
              </a>
            );
          })}
          <div className="border-t border-border mt-1 pt-1 px-3 py-1 flex items-center justify-between gap-4 text-xs text-text-muted/60 whitespace-nowrap">
            <span>{label}</span>
            <Kbd keys={["Alt", "L"]} className="hidden md:inline-flex" />
          </div>
        </div>
      )}
    </div>
  );
};
