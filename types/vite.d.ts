declare module "*?url" {
  const result: string;
  export default result;
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_IS_DEV_SERVER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob<T = unknown>(
    pattern: string,
    options?: { eager?: boolean; query?: string; import?: string }
  ): Record<string, T>;
}
