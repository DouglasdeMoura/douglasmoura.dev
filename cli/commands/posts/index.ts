import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    description: "Manage blog posts",
    name: "posts",
  },
  subCommands: {
    create: async () => {
      const m = await import("./create.js");
      return m.default;
    },
    import: async () => {
      const m = await import("./import.js");
      return m.default;
    },
    list: async () => {
      const m = await import("./list.js");
      return m.default;
    },
    read: async () => {
      const m = await import("./read.js");
      return m.default;
    },
  },
});
