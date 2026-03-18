"use client";

import { useCallback } from "react";

const prefetched = new Set<string>();
let resolvedCacheName: string | null = null;

const resolveCacheName = async (): Promise<string | null> => {
  if (resolvedCacheName) {
    return resolvedCacheName;
  }

  if (!("caches" in window)) {
    return null;
  }

  const tabId = sessionStorage.getItem("rwsdk-navigation-tab-id") ?? "1";
  const prefix = `rsc-x-prefetch:rwsdk:${tabId}:`;
  const keys = await caches.keys();
  const matching = keys.filter((k) => k.startsWith(prefix));

  if (matching.length > 0) {
    const maxGen = Math.max(
      ...matching.map((k) => Number.parseInt(k.slice(prefix.length), 10))
    );
    resolvedCacheName = `${prefix}${maxGen}`;
  } else {
    resolvedCacheName = `${prefix}1`;
  }

  return resolvedCacheName;
};

const prefetchHref = async (href: string) => {
  if (prefetched.has(href)) {
    return;
  }
  prefetched.add(href);

  try {
    const cacheName = await resolveCacheName();
    if (!cacheName) {
      return;
    }

    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) {
      return;
    }
    url.searchParams.set("__rsc", "");

    const request = new Request(url.toString(), {
      headers: { "x-prefetch": "true" },
      method: "GET",
      priority: "low",
      redirect: "manual",
    });

    const cache = await caches.open(cacheName);
    const response = await fetch(request);
    if (response.status >= 400) {
      return;
    }
    await cache.put(request, response.clone());
  } catch {
    // Best-effort prefetch
  }
};

type PrefetchLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export const PrefetchLink = ({
  href,
  children,
  ...props
}: PrefetchLinkProps) => {
  const handlePrefetch = useCallback(() => {
    prefetchHref(href);
  }, [href]);

  return (
    <a
      {...props}
      href={href}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
    >
      {children}
    </a>
  );
};
