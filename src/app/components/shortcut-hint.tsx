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
      className={`pointer-events-none absolute hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface-1 px-1.5 py-0.5 text-[10px] font-medium text-text-muted ${className ?? ""}`}
    >
      {isMac ? mac : other}
    </kbd>
  );
};
