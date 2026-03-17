"use client";

import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { useCallback, useEffect, useState } from "react";

import { CommandMenu } from "#app/components/command-menu.js";

interface SearchTriggerProps {
  locale: "en-US" | "pt-BR";
  label: string;
  placeholder: string;
  emptyText: string;
}

export const SearchTrigger = ({
  locale,
  label,
  placeholder,
  emptyText,
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
      <button
        type="button"
        onClick={handleOpen}
        aria-label={label}
        className="group relative inline-flex items-center justify-center min-w-11 min-h-11 text-text-muted hover:text-text-strong transition-colors duration-150"
      >
        <MagnifyingGlassIcon size={18} weight="bold" />
        <kbd className="pointer-events-none absolute top-[calc(100%-4px)] left-1/2 hidden sm:group-hover:inline-flex items-center gap-0.5 rounded border border-border bg-surface-1 px-1.5 py-0.5 text-[10px] font-medium text-text-muted opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out group-not-hover:transition-none">
          {isMac ? "⌘" : "Ctrl+"}K
        </kbd>
      </button>
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        locale={locale}
        placeholder={placeholder}
        emptyText={emptyText}
      />
    </>
  );
};
