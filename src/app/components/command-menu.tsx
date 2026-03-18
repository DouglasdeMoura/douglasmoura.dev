"use client";

import { Command } from "cmdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Kbd } from "#app/components/kbd.js";
import type { NavItem } from "#app/components/search-trigger.js";

const formatDate = (iso: string, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  created: string;
}

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(
    async (q: string) => {
      abortRef.current?.abort();

      if (!q.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        const params = new URLSearchParams({
          limit: "10",
          locale,
          q: q.trim(),
        });
        const res = await fetch(`/api/v1/search?${params}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as {
          results: SearchResult[];
          count: number;
        };
        setResults(data.results);
      } catch {
        /* aborted */
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [locale]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(query), 200);
    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSelect = useCallback(
    (slug: string) => {
      onOpenChange(false);
      window.location.href = `/${slug}`;
    },
    [onOpenChange]
  );

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

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    },
    [onOpenChange]
  );

  const handleClearQuery = useCallback(() => {
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (query.trim()) {
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
  }, [open, query, navItems, onOpenChange]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="cmdk-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
        onKeyDown={handleBackdropKeyDown}
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
              <svg
                className="mr-2 size-4 shrink-0 text-text-muted"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.3-4.3" />
              </svg>
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
                  onClick={handleClearQuery}
                  className="ml-2 text-xs text-text-muted hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150"
                >
                  Esc
                </button>
              )}
            </div>

            <Command.List className="max-h-80 overflow-y-auto overflow-x-hidden p-1">
              {!query.trim() && navItems.length > 0 && (
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

              {loading && (
                <Command.Loading>
                  <div className="py-6 text-center text-sm text-text-muted">
                    ...
                  </div>
                </Command.Loading>
              )}

              {query.trim() && (
                <Command.Empty className="py-6 text-center text-sm text-text-muted">
                  {emptyText}
                </Command.Empty>
              )}

              {results.map((result) => (
                <Command.Item
                  key={result.slug}
                  value={result.slug}
                  onSelect={handleSelect}
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
