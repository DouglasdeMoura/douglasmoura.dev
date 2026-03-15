import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    description: "Manage blog posts",
    name: "posts",
  },
  subCommands: {
    import: async () => {
      const m = await import("./import.js");
      return m.default;
    },
  },
});
