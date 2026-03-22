import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { defineCommand } from "citty";
import { consola } from "consola";

const T_IMPORT_PATTERN =
  /import\s*\{[^}]*\bt\b[^}]*\}\s*from\s*["']#app\/lib\/i18n(?:\.js)?["']/;
const I18N_MESSAGES_MODULE = /from\s*["']#app\/lib\/i18n-messages(?:\.js)?["']/;
const KEY_PATTERN = /\bt\(\s*["']([^"']+)["']\s*\)/g;
const TRANSLATE_PATTERN = /\btranslate\s*\(\s*[^,]+,\s*["']([^"']+)["']\s*\)/g;
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

const scanFile = async (
  filePath: string,
  keys: Set<string>,
  warnings: string[]
): Promise<void> => {
  const content = await readFile(filePath, "utf8");
  const normalizedPath = filePath.replaceAll("\\", "/");
  const hasTImport = T_IMPORT_PATTERN.test(content);
  const hasMessagesModule =
    I18N_MESSAGES_MODULE.test(content) ||
    normalizedPath.endsWith("src/app/lib/i18n-messages.ts");

  if (!hasTImport && !hasMessagesModule) {
    return;
  }

  if (hasTImport) {
    for (const match of content.matchAll(KEY_PATTERN)) {
      keys.add(match[1]);
    }

    const dynamicMatches = content.match(DYNAMIC_PATTERN);
    if (dynamicMatches) {
      for (const match of dynamicMatches) {
        if (/\bt\(\s*["']/.test(match)) {
          continue;
        }
        warnings.push(`${filePath}: dynamic t() call found: ${match.trim()}`);
      }
    }
  }

  if (hasMessagesModule) {
    for (const match of content.matchAll(TRANSLATE_PATTERN)) {
      keys.add(match[1]);
    }
  }
};

const scanForTKeys = async (
  srcDir: string,
  files?: string[]
): Promise<ScanResult> => {
  const keys = new Set<string>();
  const warnings: string[] = [];

  if (files && files.length > 0) {
    for (const file of files) {
      if (!/\.[jt]sx?$/.test(file)) {
        continue;
      }
      await scanFile(file, keys, warnings);
    }
  } else {
    const entries = await readdir(srcDir, { recursive: true });
    for (const entry of entries) {
      if (!/\.[jt]sx?$/.test(entry)) {
        continue;
      }
      await scanFile(join(srcDir, entry), keys, warnings);
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
    throw new Error(
      "Could not find translations block in src/app/lib/i18n-messages.ts"
    );
  }

  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + END_MARKER.length);
  const block = content.slice(startIdx + START_MARKER.length, endIdx);

  const locales: Record<string, Record<string, string>> = {};
  let currentLocale = "";
  let pendingKey = "";

  for (const line of block.split("\n")) {
    const localeMatch = line.match(/^\s*"([^"]+)":\s*\{/);
    if (localeMatch) {
      [, currentLocale] = localeMatch;
      locales[currentLocale] = {};
      continue;
    }

    if (currentLocale) {
      // Handle value on a continuation line (key was on the previous line)
      if (pendingKey) {
        const valueMatch = line.match(/^\s*"([^"]*)",?/);
        if (valueMatch) {
          const [, value] = valueMatch;
          locales[currentLocale][pendingKey] = value;
          pendingKey = "";
          continue;
        }
        pendingKey = "";
      }

      const kvMatch = line.match(/^\s*(?:"([^"]+)"|(\w+)):\s*"([^"]*)",?/);
      if (kvMatch) {
        const [, quotedKey, unquotedKey, kvValue] = kvMatch;
        locales[currentLocale][quotedKey ?? unquotedKey] = kvValue;
        continue;
      }

      // Key on this line, value on the next (linter-wrapped long lines)
      const keyOnlyMatch = line.match(/^\s*(?:"([^"]+)"|(\w+)):\s*$/);
      if (keyOnlyMatch) {
        pendingKey = keyOnlyMatch[1] ?? keyOnlyMatch[2];
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

const checkPartialKeys = (
  keys: Set<string>,
  locales: Record<string, Record<string, string>>
): void => {
  const missing: string[] = [];
  for (const locale of Object.keys(locales)) {
    for (const key of keys) {
      if (!locales[locale][key]) {
        missing.push(`${locale}: "${key}"`);
      }
    }
  }
  if (missing.length > 0) {
    consola.info(`Missing ${missing.length} translation(s):`);
    for (const entry of missing) {
      consola.log(`  + ${entry}`);
    }
    consola.error(
      "Translations are out of sync. Run `pnpm cli i18n extract` to fix."
    );
    process.exit(1);
  }
  consola.success("Translations are up to date");
};

const reportDiff = (added: string[], stale: string[]): void => {
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
};

export default defineCommand({
  args: {
    check: {
      description:
        "Check only — exit with code 1 if translations are out of sync",
      type: "boolean",
    },
    files: {
      description:
        "Only scan specific files for t() keys (e.g. --files src/app/pages/home.tsx src/app/pages/post.tsx)",
      required: false,
      type: "positional",
    },
    "keep-stale": {
      description: "Keep stale keys instead of removing them",
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
    const i18nMessagesPath = join(cwd, "src/app/lib/i18n-messages.ts");

    const rawFiles = args.files as unknown as string | undefined;
    const fileList = rawFiles
      ? rawFiles.split(/\s+/).filter(Boolean)
      : undefined;
    const isPartialScan = fileList && fileList.length > 0;

    const { keys, warnings } = await scanForTKeys(srcDir, fileList);

    if (warnings.length > 0) {
      for (const warning of warnings) {
        consola.warn(warning);
      }
    }

    if (isPartialScan && keys.size === 0) {
      consola.success("No translation keys found in scanned files");
      return;
    }

    consola.info(`Found ${keys.size} unique translation key(s)`);

    const { locales, before, after } =
      await parseTranslationsFile(i18nMessagesPath);

    if (isPartialScan && args.check) {
      checkPartialKeys(keys, locales);
      return;
    }

    const keepStale = Boolean(args["keep-stale"]);
    const { merged, added, stale } = mergeTranslations(
      locales,
      keys,
      !keepStale
    );

    if (added.length === 0 && stale.length === 0) {
      consola.success("Translations are up to date");
      return;
    }

    reportDiff(added, stale);

    if (args.check) {
      consola.error(
        "Translations are out of sync. Run `pnpm cli i18n extract` to fix."
      );
      process.exit(1);
    }

    if (stale.length > 0 && !keepStale) {
      consola.info(`Removing ${stale.length} stale key(s)`);
    }

    const block = buildTranslationsBlock(merged);
    await writeFile(i18nMessagesPath, `${before}${block}${after}`, "utf8");

    consola.success("Updated translations in src/app/lib/i18n-messages.ts");
  },
});
