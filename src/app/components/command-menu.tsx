"use client";

import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { Command } from "cmdk";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";

import { Kbd } from "#app/components/kbd.js";
import type { NavItem } from "#app/components/search-trigger.js";
import type { SearchResult } from "#app/lib/search.js";

interface SearchResponse {
  results: SearchResult[];
  count: number;
}

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

const formatDate = (iso: string, locale: string): string => {
  let fmt = dateFormatters.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    dateFormatters.set(locale, fmt);
  }
  return fmt.format(new Date(iso));
};

const searchFetcher = async (url: string) => {
  const res = await fetch(url);
  return (await res.json()) as SearchResponse;
};

const useDebouncedValue = <T,>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: "en-US" | "pt-BR";
  placeholder: string;
  emptyText: string;
  navItems?: NavItem[];
}

export const CommandMenu = ({
  open,
  onOpenChange,
  locale,
  placeholder,
  emptyText,
  navItems = [],
}: CommandMenuProps) => {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const debouncedQuery = useDebouncedValue(trimmed, 200);

  const swrKey =
    open && debouncedQuery
      ? `/api/v1/search?${new URLSearchParams({ limit: "10", locale, q: debouncedQuery })}`
      : null;

  const { data, isLoading } = useSWR(swrKey, searchFetcher, {
    keepPreviousData: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const results = data?.results ?? [];

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const handleNavigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      window.location.href = href;
    },
    [onOpenChange]
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (trimmed) {
        return;
      }
      for (const item of navItems) {
        if (item.shortcut?.length === 1 && e.key === item.shortcut[0]) {
          e.preventDefault();
          onOpenChange(false);
          window.location.href = item.href;
          return;
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, trimmed, navItems, onOpenChange]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* oxlint-disable-next-line eslint-plugin-jsx-a11y(click-events-have-key-events) -- Escape key handled by Command */}
      <div
        className="cmdk-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
        role="presentation"
      />

      <div className="fixed inset-0 top-[20%] flex justify-center px-4 pointer-events-none">
        <div className="cmdk-dialog w-full max-w-lg pointer-events-auto">
          <Command
            label="Search posts"
            shouldFilter={false}
            className="rounded-xl border border-border bg-surface-0 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center border-b border-border px-3">
              <MagnifyingGlassIcon
                size={16}
                className="mr-2 shrink-0 text-text-muted"
              />
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder={placeholder}
                className="flex h-12 w-full bg-transparent py-3 text-sm text-text outline-none ring-0 border-none shadow-none caret-accent placeholder:text-text-muted"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="ml-2 text-xs text-text-muted hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150"
                >
                  Esc
                </button>
              )}
            </div>

            <Command.List className="max-h-80 overflow-y-auto overflow-x-hidden p-1">
              {!trimmed && navItems.length > 0 && (
                <Command.Group
                  heading="Pages"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted"
                >
                  {navItems.map((item) => (
                    <Command.Item
                      key={item.href}
                      value={item.href}
                      onSelect={handleNavigate}
                      className="flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted outline-none select-none data-[selected=true]:bg-surface-1 data-[selected=true]:text-text-strong"
                    >
                      {item.icon && (
                        <span className="size-4 shrink-0">{item.icon}</span>
                      )}
                      {item.label}
                      {item.shortcut && (
                        <span className="ml-auto">
                          <Kbd keys={item.shortcut} />
                        </span>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {isLoading && !data && (
                <Command.Loading>
                  <div className="py-6 text-center text-sm text-text-muted">
                    ...
                  </div>
                </Command.Loading>
              )}

              {debouncedQuery && !isLoading && results.length === 0 && (
                <Command.Empty className="py-6 text-center text-sm text-text-muted">
                  {emptyText}
                </Command.Empty>
              )}

              {results.map((result) => (
                <Command.Item
                  key={result.slug}
                  value={`/${result.slug}`}
                  onSelect={handleNavigate}
                  className="group relative flex cursor-default flex-col gap-0.5 rounded-lg px-3 py-2.5 text-sm outline-none select-none data-[selected=true]:bg-surface-1"
                >
                  <span className="font-medium text-text-strong group-data-[selected=true]:text-accent">
                    {result.title}
                  </span>
                  <span className="text-xs text-text-muted line-clamp-1">
                    {formatDate(result.created, locale)}
                    {result.tags.length > 0 && (
                      <> &middot; {result.tags.join(", ")}</>
                    )}
                  </span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </div>
      </div>
    </div>,
    document.body
  );
};
