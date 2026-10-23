"use client";

import { Kbd } from "#app/components/kbd.js";

interface ShortcutHintProps {
  label: string;
  keys: string[];
}

export const ShortcutHint = ({ label, keys }: ShortcutHintProps) => (
  <span
    role="tooltip"
    aria-hidden="true"
    className="border-border bg-surface-1 text-text group-not-hover:transition-none pointer-events-none absolute top-full left-1/2 mt-2 hidden -translate-x-1/2 translate-y-1 items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs whitespace-nowrap opacity-0 shadow-sm group-hover:translate-y-0 group-hover:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] sm:group-hover:flex"
  >
    {label}
    <Kbd keys={keys} />
  </span>
);
