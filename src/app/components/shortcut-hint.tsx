"use client";

import { Kbd } from "#app/components/kbd.js";

interface ShortcutHintProps {
  label: string;
  keys: string[];
}

export const ShortcutHint = ({ label, keys }: ShortcutHintProps) => (
  <span
    role="tooltip"
    className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 hidden sm:group-hover:flex items-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface-1 px-2.5 py-1.5 text-xs text-text shadow-sm opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 motion-safe:transition-[opacity,transform] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] group-not-hover:transition-none"
  >
    {label}
    <Kbd keys={keys} />
  </span>
);
