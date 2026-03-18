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

  const selectTheme = useCallback((next: Theme) => {
    setUserSelectedSystem(next === "system");
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

  const selectSystem = useCallback(() => selectTheme("system"), [selectTheme]);
  const selectLight = useCallback(() => selectTheme("light"), [selectTheme]);
  const selectDark = useCallback(() => selectTheme("dark"), [selectTheme]);

  const themeCallbacks: Record<Theme, () => void> = {
    dark: selectDark,
    light: selectLight,
    system: selectSystem,
  };

  const showMonitor = theme === "system" && userSelectedSystem;

  let activeIcon = isDark ? (
    <MoonIcon size={18} weight="fill" />
  ) : (
    <SunIcon size={18} weight="fill" />
  );
  if (showMonitor) {
    activeIcon = <MonitorIcon size={18} weight="fill" />;
  }

  return (
    <div className="group/theme relative size-8">
      {/* Cycle button — always visible, primary interaction on mobile */}
      <button
        type="button"
        onClick={cycle}
        aria-label={`${label}: ${THEME_LABELS[theme]}`}
        className="inline-flex items-center justify-center size-8 text-text-muted hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150"
      >
        {activeIcon}
      </button>

      {/* Expanding pill — anchored at top, fixed order, expands downward */}
      <div
        role="radiogroup"
        aria-label={label}
        className="hidden sm:flex absolute z-10 top-0 left-1/2 -translate-x-1/2 flex-col items-center rounded-full opacity-0 pointer-events-none border border-transparent group-hover/theme:opacity-100 group-hover/theme:pointer-events-auto group-hover/theme:border-border group-hover/theme:bg-surface-1 group-hover/theme:shadow-sm motion-safe:transition-[opacity,border-color,background-color,box-shadow] motion-safe:duration-200"
      >
        {CYCLE_ORDER.map((t, i) => {
          const isActive = theme === t;
          const isFirst = i === 0;
          const onClick = themeCallbacks[t];
          return isFirst ? (
            <ThemeButton
              key={t}
              theme={t}
              isActive={isActive}
              onClick={onClick}
            />
          ) : (
            <div
              key={t}
              className="overflow-hidden h-0 group-hover/theme:h-8 motion-safe:transition-[height] motion-safe:duration-200"
            >
              <ThemeButton theme={t} isActive={isActive} onClick={onClick} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
