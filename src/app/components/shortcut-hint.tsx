"use client";

import { useEffect, useState } from "react";

interface ShortcutHintProps {
  mac: string;
  other: string;
  className?: string;
}

export const ShortcutHint = ({ mac, other, className }: ShortcutHintProps) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.startsWith("Mac"));
  }, []);

  return (
    <kbd
      className={`pointer-events-none absolute hidden sm:group-hover:inline-flex items-center gap-0.5 rounded border border-border bg-surface-1 px-1.5 py-0.5 text-[10px] font-medium text-text-muted opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out group-not-hover:transition-none ${className ?? ""}`}
    >
      {isMac ? mac : other}
    </kbd>
  );
};
