import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    description: "Resume utilities",
    name: "resume",
  },
  subCommands: {
    pdf: async () => {
      const m = await import("./pdf.js");
      return m.default;
    },
  },
});
