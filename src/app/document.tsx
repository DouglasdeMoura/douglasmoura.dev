import type { RequestInfo } from "rwsdk/worker";

import styles from "./styles.css?url";

const themeScript = `(function(){
  var t = document.documentElement.dataset.theme || "system";
  var d = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme:dark)").matches);
  if (d) document.documentElement.classList.add("dark");
})();`;

export const Document: React.FC<
  RequestInfo & { children: React.ReactNode }
> = ({ ctx, children }) => {
  const appCtx = ctx as { locale?: string; theme?: string };
  const theme = appCtx.theme ?? "system";

  return (
    <html lang={appCtx.locale === "pt-BR" ? "pt-BR" : "en"} data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Douglas Moura</title>
        <meta
          name="description"
          content="Douglas Moura — Software Engineer. Articles on web development, TypeScript, React, and more."
        />
        <script
          /* oxlint-disable-next-line eslint-plugin-react(no-danger) -- FOUC prevention: must run before paint */
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <link rel="stylesheet" href={styles} />
        <link rel="modulepreload" href="/src/client.tsx" />
      </head>
      <body>
        {children}
        <script>import(&quot;/src/client.tsx&quot;)</script>
      </body>
    </html>
  );
};
