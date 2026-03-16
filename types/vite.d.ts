declare module "*?url" {
  const result: string;
  export default result;
}

interface ImportMeta {
  glob<T = unknown>(
    pattern: string,
    options?: { eager?: boolean; query?: string; import?: string }
  ): Record<string, T>;
}
