"use client";

const MAC_SYMBOLS: Record<string, string> = {
  Alt: "⌥",
  CmdOrCtrl: "⌘",
  Ctrl: "⌃",
  Meta: "⌘",
  Shift: "⇧",
};

const OTHER_SYMBOLS: Record<string, string> = {
  CmdOrCtrl: "Ctrl",
};

let detectedMac: boolean | undefined;

const isMac = (): boolean => {
  if (detectedMac === undefined) {
    detectedMac =
      typeof navigator !== "undefined" &&
      ((navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData?.platform === "macOS" ||
        navigator.platform.startsWith("Mac"));
  }
  return detectedMac;
};

interface KbdProps {
  keys: string[];
}

export const Kbd = ({ keys }: KbdProps) => {
  const mac = isMac();
  const symbols = mac ? MAC_SYMBOLS : OTHER_SYMBOLS;

  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key) => (
        <kbd
          key={key}
          className="inline-flex items-center justify-center min-w-5 rounded border border-border bg-surface-0 px-1 py-0.5 text-[10px] leading-none text-text-muted"
        >
          {symbols[key] ?? key}
        </kbd>
      ))}
    </span>
  );
};
