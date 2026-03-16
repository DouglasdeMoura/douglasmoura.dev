"use client";

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

export const ThemeToggle = ({ initialTheme }: { initialTheme: Theme }) => {
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
  const label = labels[theme];

  return (
    <button type="button" onClick={cycle} aria-label={`Theme: ${label}`}>
      {label}
    </button>
  );
};
