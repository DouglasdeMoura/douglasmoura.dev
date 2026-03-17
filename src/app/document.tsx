import type { RequestInfo } from "rwsdk/worker";

import { Header } from "#app/components/header.js";

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
        <title>Douglas Moura</title>
        <meta
          name="description"
          content="Douglas Moura — Software Engineer. Articles on web development, TypeScript, React, and more."
        />
        <script
          nonce={rw.nonce}
          /* oxlint-disable-next-line eslint-plugin-react(no-danger) -- FOUC prevention: must run before paint */
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <link rel="stylesheet" href={styles} />
        <link rel="modulepreload" href="/src/client.tsx" />
      </head>
      <body>
        <Header theme={theme as "light" | "dark" | "system"} />
        <main>{children}</main>
        <script>import(&quot;/src/client.tsx&quot;)</script>
      </body>
    </html>
  );
};
