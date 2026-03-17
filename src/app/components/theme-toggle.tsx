"use client";

import { Monitor as MonitorIcon } from "@phosphor-icons/react/dist/csr/Monitor";
import { Moon as MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { Sun as SunIcon } from "@phosphor-icons/react/dist/csr/Sun";
import { useCallback, useEffect, useState } from "react";

import { ShortcutHint } from "#app/components/shortcut-hint.js";
import { setTheme } from "#app/lib/theme-action.js";

type Theme = "light" | "dark" | "system";

const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);
  root.dataset.theme = theme;
};

interface ThemeToggleProps {
  initialTheme: Theme;
  initialExplicit: boolean;
  label: string;
}

export const ThemeToggle = ({
  initialTheme,
  initialExplicit,
  label,
}: ThemeToggleProps) => {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [userSelectedSystem, setUserSelectedSystem] = useState(
    initialExplicit && initialTheme === "system"
  );
  const [isDark, setIsDark] = useState(initialTheme === "dark");

  useEffect(() => {
    applyTheme(theme);

    const dark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);

    if (theme !== "system") {
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      applyTheme("system");
      setIsDark(mq.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const cycle = useCallback(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const osTheme: Theme = prefersDark ? "dark" : "light";
    const oppositeOfOs: Theme = prefersDark ? "light" : "dark";

    let next: Theme;
    if (theme === "system") {
      next = oppositeOfOs;
      setUserSelectedSystem(false);
    } else if (theme === oppositeOfOs) {
      next = osTheme;
      setUserSelectedSystem(false);
    } else {
      next = "system";
      setUserSelectedSystem(true);
    }

    setThemeState(next);
    setTheme(next);
  }, [theme]);

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

  const labels: Record<Theme, string> = {
    dark: "Dark",
    light: "Light",
    system: "System",
  };

  const showMonitor = theme === "system" && userSelectedSystem;

  let icon = isDark ? (
    <MoonIcon size={18} weight="fill" />
  ) : (
    <SunIcon size={18} weight="fill" />
  );
  if (showMonitor) {
    icon = <MonitorIcon size={18} weight="fill" />;
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${label}: ${labels[theme]}`}
      className="group relative inline-flex items-center justify-center min-w-11 min-h-11 text-text-muted hover:text-text-strong transition-colors duration-150"
    >
      {icon}
      <ShortcutHint label={label} mac="⌥T" other="Alt+T" />
    </button>
  );
};
