import type { RequestInfo } from "rwsdk/worker";

import styles from "./styles.css?url";

const themeScript = `(function(){
  var t = document.documentElement.dataset.theme || "system";
  if (t === "system") {
    var d = matchMedia("(prefers-color-scheme:dark)").matches;
    document.documentElement.classList.toggle("dark", d);
  }
})();`;

export const Document: React.FC<
  RequestInfo & { children: React.ReactNode }
> = ({ ctx, rw, children }) => {
  const appCtx = ctx as { locale?: string; theme?: string };
  const theme = appCtx.theme ?? "system";

  return (
    <html
      lang={appCtx.locale === "pt-BR" ? "pt-BR" : "en"}
      data-theme={theme}
      className={theme === "dark" ? "dark" : undefined}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="preload"
          href="/fonts/Geist-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          nonce={rw.nonce}
          /* oxlint-disable-next-line eslint-plugin-react(no-danger) -- FOUC prevention: must run before paint */
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/favicon-light.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#fbfbfa"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#161614"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="author" href="/humans.txt" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={styles} />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Douglas Moura (English)"
          href="/en-US/feed.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Douglas Moura (Português)"
          href="/pt-BR/feed.xml"
        />
        <link rel="modulepreload" href="/src/client.tsx" />
      </head>
      <body className="bg-surface-0 text-text motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)]">
        {children}
        <script>import(&quot;/src/client.tsx&quot;)</script>
      </body>
    </html>
  );
};
