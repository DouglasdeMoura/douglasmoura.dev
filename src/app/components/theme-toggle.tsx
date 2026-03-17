"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";

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

  const cycle = useCallback(() => {
    const order: Theme[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setThemeState(next);
    setTheme(next);
  }, [theme]);

  const labels: Record<Theme, string> = {
    dark: "Dark",
    light: "Light",
    system: "System",
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${label}: ${labels[theme]}`}
      className="inline-flex items-center justify-center min-w-11 min-h-11 text-text-muted hover:text-text-strong"
    >
      {theme === "light" && <SunIcon size={18} weight="fill" />}
      {theme === "dark" && <MoonIcon size={18} weight="fill" />}
      {theme === "system" && <MonitorIcon size={18} weight="fill" />}
    </button>
  );
};
