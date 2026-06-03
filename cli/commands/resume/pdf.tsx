import { resolve } from "node:path";

import { renderToFile } from "@react-pdf/renderer";
import { defineCommand } from "citty";
import { consola } from "consola";

import resumeJson from "#app/lib/resume.json";

import { ResumeDocument } from "./template.js";
import type { Resume } from "./types.js";

const resume = resumeJson as Resume;

export default defineCommand({
  args: {
    output: {
      default: "public/resume.pdf",
      description: "Output path for the generated PDF",
      type: "string",
    },
  },
  meta: {
    description: "Generate a PDF resume from src/app/lib/resume.json",
    name: "pdf",
  },
  async run({ args }) {
    const outputPath = resolve(process.cwd(), args.output);
    await renderToFile(<ResumeDocument resume={resume} />, outputPath);
    consola.success(`Resume PDF written to ${args.output}`);
  },
});
