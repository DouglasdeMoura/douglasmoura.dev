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
      className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 hidden sm:group-hover:flex items-center gap-2 whitespace-nowrap rounded-md bg-text-strong px-2.5 py-1.5 text-xs text-surface-0 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150 ease-out group-not-hover:transition-none"
    >
      {label}
      <kbd className="rounded bg-surface-0/15 px-1.5 py-0.5 text-[10px] font-medium">
        {isMac ? mac : other}
      </kbd>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-text-strong" />
    </span>
  );
};
