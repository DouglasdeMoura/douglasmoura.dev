"use client";

import { useEffect } from "react";

import { Kbd } from "#app/components/kbd.js";

interface LocaleSwitchProps {
  href: string;
  targetLocale: "en-US" | "pt-BR";
  tooltip: string;
  label: string;
}

export const LocaleSwitch = ({
  href,
  targetLocale,
  label,
  tooltip,
}: LocaleSwitchProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "l") {
        e.preventDefault();
        window.location.href = href;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [href]);

  return (
    <a
      href={href}
      lang={targetLocale}
      hrefLang={targetLocale}
      className="group relative"
    >
      {label}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden sm:group-hover:flex items-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface-1 px-2.5 py-1.5 text-xs text-text shadow-sm opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 motion-safe:transition-[opacity,transform] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] group-not-hover:transition-none"
      >
        {tooltip}
        <Kbd keys={["Alt", "L"]} />
      </span>
    </a>
  );
};
