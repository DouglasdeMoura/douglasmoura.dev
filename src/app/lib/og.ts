import { ImageResponse } from "workers-og";

import { buildGenericOgHtml, buildOgHtml } from "#app/components/og-image.js";
import type { Post } from "#app/lib/posts.js";

const fontCache = new Map<string, ArrayBuffer>();

const loadGoogleFont = async (
  family: string,
  weight: number
): Promise<ArrayBuffer> => {
  const cacheKey = `${family}-${weight}`;
  const cached = fontCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
  const cssResponse = await fetch(url);
  const css = await cssResponse.text();
  const fontUrlMatch = css.match(
    /src:\s*url\(([^)]+)\)\s*format\('(?:woff2|truetype)'\)/
  );
  if (!fontUrlMatch?.[1]) {
    throw new Error(`Failed to load font: ${family} ${weight}`);
  }
  const fontResponse = await fetch(fontUrlMatch[1]);
  const buffer = await fontResponse.arrayBuffer();
  fontCache.set(cacheKey, buffer);
  return buffer;
};

const loadFonts = (): Promise<[ArrayBuffer, ArrayBuffer]> =>
  Promise.all([loadGoogleFont("Geist", 700), loadGoogleFont("Geist", 500)]);

const ogFonts = (bold: ArrayBuffer, medium: ArrayBuffer) => [
  { data: bold, name: "Geist", style: "normal" as const, weight: 700 },
  { data: medium, name: "Geist", style: "normal" as const, weight: 500 },
];

export const generateOgImage = async (
  post: Post,
  siteUrl: string
): Promise<Response> => {
  const [geistBold, geistMedium] = await loadFonts();
  const { hostname } = new URL(siteUrl);

  return new ImageResponse(buildOgHtml(post, hostname), {
    fonts: ogFonts(geistBold, geistMedium),
    height: 948,
    width: 1686,
  });
};

export const generateGenericOgImage = async (
  title: string,
  siteUrl: string
): Promise<Response> => {
  const [geistBold, geistMedium] = await loadFonts();
  const { hostname } = new URL(siteUrl);

  return new ImageResponse(buildGenericOgHtml(title, hostname), {
    fonts: ogFonts(geistBold, geistMedium),
    height: 948,
    width: 1686,
  });
};
