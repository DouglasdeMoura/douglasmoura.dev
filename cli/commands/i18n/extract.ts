import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { defineCommand } from "citty";
import { consola } from "consola";

const IMPORT_PATTERN =
  /import\s*\{[^}]*\bt\b[^}]*\}\s*from\s*["']#app\/lib\/i18n/;
const KEY_PATTERN = /\bt\(\s*["']([^"']+)["']\s*\)/g;
const DYNAMIC_PATTERN = /\bt\(\s*[^"']/g;

const START_MARKER = "const translations = {";
const END_MARKER =
  "} as const satisfies Record<string, Record<string, string>>;";

interface ScanResult {
  keys: Set<string>;
  warnings: string[];
}
interface ParseResult {
  locales: Record<string, Record<string, string>>;
  before: string;
  after: string;
}
interface MergeResult {
  merged: Record<string, Record<string, string>>;
  added: string[];
  stale: string[];
}

const scanForTKeys = async (srcDir: string): Promise<ScanResult> => {
  const keys = new Set<string>();
  const warnings: string[] = [];
  const entries = await readdir(srcDir, { recursive: true });

  for (const entry of entries) {
    if (!/\.[jt]sx?$/.test(entry)) {
      continue;
    }

    const filePath = join(srcDir, entry);
    const content = await readFile(filePath, "utf8");

    if (!IMPORT_PATTERN.test(content)) {
      continue;
    }

    for (const match of content.matchAll(KEY_PATTERN)) {
      keys.add(match[1]);
    }

    const dynamicMatches = content.match(DYNAMIC_PATTERN);
    if (dynamicMatches) {
      for (const match of dynamicMatches) {
        // Skip matches that are actually string literals (already captured above)
        if (/\bt\(\s*["']/.test(match)) {
          continue;
        }
        warnings.push(`${filePath}: dynamic t() call found: ${match.trim()}`);
      }
    }
  }

  return { keys, warnings };
};

const parseTranslationsFile = async (
  filePath: string
): Promise<ParseResult> => {
  const content = await readFile(filePath, "utf8");
  const startIdx = content.indexOf(START_MARKER);
  const endIdx = content.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error("Could not find translations block in i18n.ts");
  }

  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + END_MARKER.length);
  const block = content.slice(startIdx + START_MARKER.length, endIdx);

  const locales: Record<string, Record<string, string>> = {};
  let currentLocale = "";

  for (const line of block.split("\n")) {
    const localeMatch = line.match(/^\s*"([^"]+)":\s*\{/);
    if (localeMatch) {
      [, currentLocale] = localeMatch;
      locales[currentLocale] = {};
      continue;
    }

    if (currentLocale) {
      const kvMatch = line.match(/^\s*"([^"]+)":\s*"([^"]*)",?/);
      if (kvMatch) {
        const [, kvKey, kvValue] = kvMatch;
        locales[currentLocale][kvKey] = kvValue;
        continue;
      }

      if (/^\s*\},?/.test(line)) {
        currentLocale = "";
      }
    }
  }

  return { after, before, locales };
};

const mergeTranslations = (
  existing: Record<string, Record<string, string>>,
  extractedKeys: Set<string>,
  removeStale: boolean
): MergeResult => {
  const added: string[] = [];
  const stale: string[] = [];
  const merged: Record<string, Record<string, string>> = {};

  for (const locale of Object.keys(existing)) {
    const result: Record<string, string> = {};

    for (const key of extractedKeys) {
      result[key] = existing[locale][key] ?? "";
      if (!(key in existing[locale])) {
        added.push(`${locale}: "${key}"`);
      }
    }

    for (const key of Object.keys(existing[locale])) {
      if (!extractedKeys.has(key)) {
        stale.push(`${locale}: "${key}"`);
        if (!removeStale) {
          result[key] = existing[locale][key];
        }
      }
    }

    merged[locale] = result;
  }

  return { added, merged, stale };
};

const buildTranslationsBlock = (
  locales: Record<string, Record<string, string>>
): string => {
  const lines: string[] = [START_MARKER];

  const localeNames = Object.keys(locales).toSorted();
  for (const locale of localeNames) {
    lines.push(`  "${locale}": {`);
    const keys = Object.keys(locales[locale]).toSorted();
    for (const key of keys) {
      lines.push(`    "${key}": "${locales[locale][key]}",`);
    }
    lines.push("  },");
  }

  lines.push(END_MARKER);
  return lines.join("\n");
};

export default defineCommand({
  args: {
    check: {
      description:
        "Check only — exit with code 1 if translations are out of sync",
      type: "boolean",
    },
    "remove-stale": {
      description: "Remove stale keys instead of just warning",
      type: "boolean",
    },
  },
  meta: {
    description: "Extract t() keys and sync translations",
    name: "extract",
  },
  async run({ args }) {
    const cwd = process.cwd();
    const srcDir = join(cwd, "src");
    const i18nPath = join(cwd, "src/app/lib/i18n.ts");

    const { keys, warnings } = await scanForTKeys(srcDir);

    if (warnings.length > 0) {
      for (const warning of warnings) {
        consola.warn(warning);
      }
    }

    consola.info(`Found ${keys.size} unique t() key(s)`);

    const { locales, before, after } = await parseTranslationsFile(i18nPath);
    const removeStale = Boolean(args["remove-stale"]);
    const { merged, added, stale } = mergeTranslations(
      locales,
      keys,
      removeStale
    );

    if (added.length === 0 && stale.length === 0) {
      consola.success("Translations are up to date");
      return;
    }

    if (added.length > 0) {
      consola.info(`Missing ${added.length} key(s):`);
      for (const entry of added) {
        consola.log(`  + ${entry}`);
      }
    }

    if (stale.length > 0) {
      consola.warn(`Stale ${stale.length} key(s):`);
      for (const entry of stale) {
        consola.log(`  - ${entry}`);
      }
    }

    if (args.check) {
      consola.error(
        "Translations are out of sync. Run `pnpm cli i18n extract` to fix."
      );
      process.exit(1);
    }

    if (removeStale) {
      consola.info(`Removing ${stale.length} stale key(s)`);
    }

    const block = buildTranslationsBlock(merged);
    await writeFile(i18nPath, `${before}${block}${after}`, "utf8");

    consola.success("Updated translations in src/app/lib/i18n.ts");
  },
});
