"use client";

import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { useCallback, useEffect, useState } from "react";

import { CommandMenu } from "#app/components/command-menu.js";
export interface NavItem {
  label: string;
  href: string;
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
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.startsWith("Mac"));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    },
    [open]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      {/* Mobile: icon only */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label={label}
        className="group relative sm:hidden inline-flex items-center justify-center min-w-11 min-h-11 text-text-muted hover:text-text-strong transition-colors duration-150"
      >
        <MagnifyingGlassIcon size={18} weight="bold" />
      </button>

      {/* Desktop: search pill */}
      <button
        type="button"
        onClick={handleOpen}
        className="group relative hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-surface-0 px-3 py-1.5 text-sm text-text-muted hover:text-text hover:border-text-muted transition-colors duration-150"
      >
        <MagnifyingGlassIcon size={14} weight="bold" />
        <span>{label}…</span>
        <span className="inline-flex items-center gap-0.5 ml-1">
          <kbd className="text-[10px]">{isMac ? "⌘" : "Ctrl"}</kbd>
          <kbd className="text-[10px]">K</kbd>
        </span>
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
