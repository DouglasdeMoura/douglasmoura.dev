"use client";

import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { Spinner } from "@phosphor-icons/react/dist/csr/Spinner";
import { Command } from "cmdk";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { navigate } from "rwsdk/client";
import useSWR from "swr";

import { Kbd } from "#app/components/kbd.js";
import type { NavItem } from "#app/components/search-trigger.js";
import {
  formatDateShortLocale,
  getCommandMenuLabels,
} from "#app/lib/i18n-messages.js";
import type { CommandMenuLabels, Locale } from "#app/lib/i18n-messages.js";
import type { SearchResult } from "#app/lib/search.js";
import { localePathPrefix } from "#app/lib/site.js";

interface SearchResponse {
  results: SearchResult[];
  count: number;
}

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

const groupHeadingClasses =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-text-muted";

const navItemClasses =
  "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted outline-none select-none data-[selected=true]:bg-surface-2 data-[selected=true]:text-accent";

const NavItemGroup = ({
  heading,
  items,
  onSelect,
}: {
  heading: string;
  items: NavItem[];
  onSelect: (href: string) => void;
}) => (
  <Command.Group heading={heading} className={groupHeadingClasses}>
    {items.map((item) => (
      <Command.Item
        key={item.href}
        value={item.href}
        onSelect={onSelect}
        className={navItemClasses}
      >
        {item.icon && <span className="size-4 shrink-0">{item.icon}</span>}
        {item.label}
        {item.shortcut && (
          <span className="ml-auto hidden sm:inline-flex">
            <Kbd keys={item.shortcut} />
          </span>
        )}
      </Command.Item>
    ))}
  </Command.Group>
);

const SearchResults = ({
  heading,
  results,
  locale,
  onSelect,
}: {
  heading: string;
  results: SearchResult[];
  locale: Locale;
  onSelect: (href: string) => void;
}) => (
  <Command.Group heading={heading} className={groupHeadingClasses}>
    {results.map((result) => (
      <Command.Item
        key={result.slug}
        value={`/${result.slug}`}
        onSelect={onSelect}
        className="group relative flex cursor-default flex-col gap-0.5 rounded-lg px-3 py-2.5 text-sm outline-none select-none data-[selected=true]:bg-surface-2"
      >
        <span className="font-medium text-text-strong group-data-[selected=true]:text-accent">
          {result.title}
        </span>
        <span className="text-xs text-text-muted line-clamp-1">
          {formatDateShortLocale(locale, result.created)}
          {result.tags.length > 0 && <> &middot; {result.tags.join(", ")}</>}
        </span>
      </Command.Item>
    ))}
  </Command.Group>
);

const SearchResultsSkeleton = () => (
  <div className="p-1">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex flex-col gap-1.5 rounded-lg px-3 py-2.5">
        <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-surface-2" />
        <div className="h-2.5 w-1/2 animate-pulse rounded-md bg-surface-2" />
      </div>
    ))}
  </div>
);

const useNavShortcuts = (
  open: boolean,
  hasQuery: boolean,
  navItems: NavItem[],
  onOpenChange: (open: boolean) => void
) => {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (hasQuery) {
        return;
      }
      for (const item of navItems) {
        if (item.shortcut?.length === 1 && e.key === item.shortcut[0]) {
          e.preventDefault();
          onOpenChange(false);
          if (item.forceReload) {
            window.location.href = item.href;
          } else {
            navigate(item.href);
          }
          return;
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, hasQuery, navItems, onOpenChange]);
};

const CommandListContent = ({
  trimmed,
  debouncedQuery,
  isPending,
  results,
  locale,
  labels,
  pageItems,
  preferenceItems,
  emptyText,
  onSelect,
}: {
  trimmed: string;
  debouncedQuery: string;
  isPending: boolean;
  results: SearchResult[];
  locale: Locale;
  labels: CommandMenuLabels;
  pageItems: NavItem[];
  preferenceItems: NavItem[];
  emptyText: string;
  onSelect: (href: string) => void;
}) => {
  const searchPrefix = localePathPrefix(locale);
  const searchHref = trimmed
    ? `${searchPrefix}/search?q=${encodeURIComponent(trimmed)}`
    : "";

  return (
    <>
      {trimmed && (
        <Command.Item
          value={searchHref}
          onSelect={onSelect}
          className={navItemClasses}
        >
          <span className="size-4 shrink-0">
            <MagnifyingGlassIcon size={16} />
          </span>
          {labels.searchFor} &ldquo;{trimmed}&rdquo;
        </Command.Item>
      )}

      {!trimmed && pageItems.length > 0 && (
        <NavItemGroup
          heading={labels.pages}
          items={pageItems}
          onSelect={onSelect}
        />
      )}

      {!trimmed && preferenceItems.length > 0 && (
        <NavItemGroup
          heading={labels.preferences}
          items={preferenceItems}
          onSelect={onSelect}
        />
      )}

      {isPending && results.length === 0 && <SearchResultsSkeleton />}

      {debouncedQuery && !isPending && results.length === 0 && (
        <Command.Empty className="py-6 text-center text-sm text-text-muted">
          {emptyText}
        </Command.Empty>
      )}

      {debouncedQuery && results.length > 0 && (
        <SearchResults
          heading={labels.posts}
          results={results}
          locale={locale}
          onSelect={onSelect}
        />
      )}
    </>
  );
};

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
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
  const isDebouncing = trimmed !== debouncedQuery;
  const isPending = !!trimmed && (isDebouncing || isLoading);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const handleNavigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      const item = navItems.find((n) => n.href === href);
      if (item?.forceReload) {
        window.location.href = href;
      } else {
        navigate(href);
      }
    },
    [onOpenChange, navItems]
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useNavShortcuts(open, !!trimmed, navItems, onOpenChange);

  if (!open) {
    return null;
  }

  const commandMenuLabels = getCommandMenuLabels(locale);
  const pageItems = navItems.filter((n) => !n.group || n.group === "pages");
  const preferenceItems = navItems.filter((n) => n.group === "preferences");
  const showSpinner = isPending;

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
            label="Command palette"
            shouldFilter={false}
            className="rounded-xl border border-border bg-surface-0 shadow-2xl ring-1 ring-black/5 overflow-hidden"
          >
            <div className="flex items-center border-b border-border px-3">
              {showSpinner ? (
                <Spinner
                  size={16}
                  className="mr-2 shrink-0 text-text-muted animate-spin"
                />
              ) : (
                <MagnifyingGlassIcon
                  size={16}
                  className="mr-2 shrink-0 text-text-muted"
                />
              )}
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder={placeholder}
                className="flex h-12 w-full bg-transparent py-3 text-sm text-text outline-none ring-0 border-none shadow-none placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={handleClose}
                className="ml-2 hidden sm:inline-flex text-xs text-text-muted hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150"
              >
                <Kbd keys={["Esc"]} />
              </button>
            </div>

            <Command.List className="max-h-96 overflow-y-auto overflow-x-hidden p-1">
              <CommandListContent
                trimmed={trimmed}
                debouncedQuery={debouncedQuery}
                isPending={isPending}
                results={results}
                locale={locale}
                labels={commandMenuLabels}
                pageItems={pageItems}
                preferenceItems={preferenceItems}
                emptyText={emptyText}
                onSelect={handleNavigate}
              />
            </Command.List>

            <div className="hidden sm:flex items-center gap-3 border-t border-border px-3 py-2 text-[11px] text-text-muted">
              <span className="inline-flex items-center gap-1">
                <Kbd keys={["↑↓"]} /> {commandMenuLabels.navigate}
              </span>
              <span className="inline-flex items-center gap-1">
                <Kbd keys={["↵"]} /> {commandMenuLabels.open}
              </span>
              <span className="inline-flex items-center gap-1">
                <Kbd keys={["Esc"]} /> {commandMenuLabels.close}
              </span>
            </div>
          </Command>
        </div>
      </div>
    </div>,
    document.body
  );
};
