"use client";

import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { useCallback, useEffect, useState } from "react";

import { CommandMenu } from "#app/components/command-menu.js";
import { ShortcutHint } from "#app/components/shortcut-hint.js";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  shortcut?: string;
}

interface SearchTriggerProps {
  locale: "en-US" | "pt-BR";
  label: string;
  placeholder: string;
  emptyText: string;
  navItems?: NavItem[];
}

export const SearchTrigger = ({
  locale,
  label,
  placeholder,
  emptyText,
  navItems = [],
}: SearchTriggerProps) => {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={label}
        className="group relative inline-flex items-center justify-center size-8 text-text-muted hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150"
      >
        <MagnifyingGlassIcon size={18} weight="bold" />
        <ShortcutHint label={label} mac={["⌘", "K"]} other={["Ctrl", "K"]} />
      </button>

      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        locale={locale}
        placeholder={placeholder}
        emptyText={emptyText}
        navItems={navItems}
      />
    </>
  );
};
