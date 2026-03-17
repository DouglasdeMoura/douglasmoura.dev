"use client";

import { useEffect, useState } from "react";

interface ShortcutHintProps {
  label: string;
  mac: string;
  other: string;
}

export const ShortcutHint = ({ label, mac, other }: ShortcutHintProps) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.startsWith("Mac"));
  }, []);

  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 hidden sm:group-hover:flex items-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface-1 px-2.5 py-1.5 text-xs text-text shadow-sm opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150 ease-out group-not-hover:transition-none"
    >
      {label}
      <kbd className="rounded border border-border bg-surface-0 px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
        {isMac ? mac : other}
      </kbd>
    </span>
  );
};
