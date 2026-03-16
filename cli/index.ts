import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    description: "CLI for managing douglasmoura.dev",
    name: "blog",
    version: "1.0.0",
  },
  subCommands: {
    i18n: async () => {
      const m = await import("./commands/i18n/index.js");
      return m.default;
    },
    posts: async () => {
      const m = await import("./commands/posts/index.js");
      return m.default;
    },
  },
});

runMain(main);
