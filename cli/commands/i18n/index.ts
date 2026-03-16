import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    description: "Internationalization utilities",
    name: "i18n",
  },
  subCommands: {
    extract: async () => {
      const m = await import("./extract.js");
      return m.default;
    },
  },
});
