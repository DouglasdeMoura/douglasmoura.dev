import styles from "./styles.css?url";

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Douglas Moura</title>
      <meta
        name="description"
        content="Douglas Moura — Software Engineer. Articles on web development, TypeScript, React, and more."
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
