import { ImageResponse } from "workers-og";

import { buildOgHtml } from "#app/components/og-image.js";
import type { Post } from "#app/lib/posts.js";

const loadGoogleFont = async (
  family: string,
  weight: number
): Promise<ArrayBuffer> => {
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
  return fontResponse.arrayBuffer();
};

export const generateOgImage = async (
  post: Post,
  siteUrl: string
): Promise<Response> => {
  const [interExtraBold, interMedium] = await Promise.all([
    loadGoogleFont("Inter", 800),
    loadGoogleFont("Inter", 500),
  ]);

  const { hostname } = new URL(siteUrl);
  const html = buildOgHtml(post, hostname);

  return new ImageResponse(html, {
    fonts: [
      {
        data: interExtraBold,
        name: "Inter",
        style: "normal" as const,
        weight: 800,
      },
      {
        data: interMedium,
        name: "Inter",
        style: "normal" as const,
        weight: 500,
      },
    ],
    height: 948,
    width: 1686,
  });
};
