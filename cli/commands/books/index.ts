import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    description: "Manage technical books",
    name: "books",
  },
  subCommands: {
    create: async () => {
      const m = await import("./create.js");
      return m.default;
    },
    list: async () => {
      const m = await import("./list.js");
      return m.default;
    },
  },
});
