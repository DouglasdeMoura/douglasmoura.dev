import type { RouteMiddleware } from "rwsdk/router";

export const setCommonHeaders =
  (): RouteMiddleware =>
  ({ response, rw: { nonce } }) => {
    if (!import.meta.env.VITE_IS_DEV_SERVER) {
      // Forces browsers to always use HTTPS for a specified time period (2 years)
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
      );
    }

    // Allow CDN and browser caching for HTML pages
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400"
    );

    // Forces browser to use the declared content-type instead of trying to guess/sniff it
    response.headers.set("X-Content-Type-Options", "nosniff");

    // Stops browsers from sending the referring webpage URL in HTTP headers
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Backward-compat frame-embedding restriction (supplements CSP frame-ancestors)
    response.headers.set("X-Frame-Options", "SAMEORIGIN");

    // Explicitly disables access to specific browser features/APIs
    response.headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()"
    );

    // Defines trusted sources for content loading and script execution.
    // unsafe-eval required: react-server-dom-webpack uses eval in the worker bundle.
    response.headers.set(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'nonce-${nonce}' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.gravatar.com https://github.com https://www.github.com https://avatars.githubusercontent.com https://dev-to-uploads.s3.amazonaws.com https://pocketbase.douglasmoura.dev https://pbs.twimg.com https://abs.twimg.com; frame-ancestors 'self'; frame-src 'self' https://challenges.cloudflare.com https://codepen.io https://stackblitz.com; object-src 'none';`
    );
  };
