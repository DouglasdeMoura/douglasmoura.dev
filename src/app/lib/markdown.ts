import { init, renderToHtml } from "md4x/wasm";

let ready: Promise<void> | undefined;

const ensureInit = (): Promise<void> => {
  if (!ready) {
    ready = init();
  }
  return ready;
};

export const renderMarkdown = async (markdown: string): Promise<string> => {
  await ensureInit();
  return renderToHtml(markdown) as string;
};
