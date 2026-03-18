"use client";

import { Monitor as MonitorIcon } from "@phosphor-icons/react/dist/csr/Monitor";
import { Moon as MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { Sun as SunIcon } from "@phosphor-icons/react/dist/csr/Sun";
import { useCallback, useEffect, useState } from "react";

import { setTheme } from "#app/lib/theme-action.js";

type Theme = "light" | "dark" | "system";

const CYCLE_ORDER: Theme[] = ["system", "light", "dark"];

const THEME_LABELS: Record<Theme, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);
  root.dataset.theme = theme;
};

const themeIcon = (t: Theme, active: boolean) => {
  const weight = active ? "fill" : "regular";
  switch (t) {
    case "system": {
      return <MonitorIcon size={18} weight={weight} />;
    }
    case "light": {
      return <SunIcon size={18} weight={weight} />;
    }
    case "dark": {
      return <MoonIcon size={18} weight={weight} />;
    }
    default: {
      const exhaustive: never = t;
      return exhaustive;
    }
  }
};

const ThemeButton = ({
  theme,
  isActive,
  onClick,
}: {
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={isActive}
    aria-label={THEME_LABELS[theme]}
    onClick={onClick}
    className={`inline-flex items-center justify-center size-8 rounded-full motion-safe:transition-[background-color,color] motion-safe:duration-150 ${
      isActive
        ? "bg-surface-2 text-text-strong"
        : "text-text-muted hover:text-text-strong hover:bg-surface-2"
    }`}
  >
    {themeIcon(theme, isActive)}
  </button>
);

interface ThemeToggleProps {
  initialTheme: Theme;
  label: string;
}

export const ThemeToggle = ({ initialTheme, label }: ThemeToggleProps) => {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") {
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const selectTheme = useCallback((next: Theme) => {
    setThemeState(next);
    setTheme(next);
  }, []);

  const cycle = useCallback(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const osTheme: Theme = prefersDark ? "dark" : "light";
    const oppositeOfOs: Theme = prefersDark ? "light" : "dark";

    let next: Theme;
    if (theme === "system") {
      next = oppositeOfOs;
    } else if (theme === oppositeOfOs) {
      next = osTheme;
    } else {
      next = "system";
    }

    selectTheme(next);
  }, [theme, selectTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        cycle();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [cycle]);

  const handleSelectSystem = useCallback(
    () => selectTheme("system"),
    [selectTheme]
  );
  const handleSelectLight = useCallback(
    () => selectTheme("light"),
    [selectTheme]
  );
  const handleSelectDark = useCallback(
    () => selectTheme("dark"),
    [selectTheme]
  );

  const handleSelect: Record<Theme, () => void> = {
    dark: handleSelectDark,
    light: handleSelectLight,
    system: handleSelectSystem,
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-1 p-1"
    >
      {CYCLE_ORDER.map((t) => (
        <ThemeButton
          key={t}
          theme={t}
          isActive={theme === t}
          onClick={handleSelect[t]}
        />
      ))}
    </div>
  );
};
