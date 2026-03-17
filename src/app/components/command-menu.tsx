"use client";

import { Command } from "cmdk";
import { useCallback, useEffect, useRef, useState } from "react";

import type { NavItem } from "#app/components/search-trigger.js";

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

  const formatDate = useCallback(
    (iso: string) =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(iso)),
    [locale]
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
        onKeyDown={handleBackdropKeyDown}
        role="presentation"
      />

      <div className="fixed left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2 px-4">
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
              value={query}
              onValueChange={setQuery}
              placeholder={placeholder}
              className="flex h-12 w-full bg-transparent py-3 text-sm text-text outline-none placeholder:text-text-muted"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearQuery}
                className="ml-2 text-xs text-text-muted hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
              >
                Esc
              </button>
            )}
          </div>

          <Command.List className="max-h-80 overflow-y-auto overflow-x-hidden p-1">
            {!query.trim() && navItems.length > 0 && (
              <Command.Group>
                {navItems.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={item.href}
                    onSelect={handleNavigate}
                    className="flex cursor-default items-center rounded-lg px-3 py-2 text-sm text-text-muted outline-none select-none data-[selected=true]:bg-surface-1 data-[selected=true]:text-text-strong"
                  >
                    {item.label}
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
                  {formatDate(result.created)}
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
  );
};
