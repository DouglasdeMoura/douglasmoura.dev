import { mkdir, utimes, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

import { defineCommand } from "citty";
import { consola } from "consola";

interface PocketbaseRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
}

interface Post extends PocketbaseRecord {
  slug: string;
  title: string;
  content: string;
  locale: "pt-BR" | "en-US";
  featuredImage: string;
  tags: string[];
  type: string;
  translates: string;
  userId: string;
}

interface Tag extends PocketbaseRecord {
  name: string;
}

interface Media extends PocketbaseRecord {
  file: string;
  mediaType: string;
  title: string;
}

interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

const fetchAllRecords = async <T extends PocketbaseRecord>(
  apiBase: string,
  collection: string
): Promise<T[]> => {
  const records: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${apiBase}/collections/${collection}/records?perPage=200&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${collection} page ${page}: ${res.status}`
      );
    }
    const data: PaginatedResponse<T> = await res.json();
    records.push(...data.items);
    ({ totalPages } = data);
    page += 1;
  }

  consola.info(`Fetched ${records.length} ${collection} records`);
  return records;
};

const downloadFile = async (
  url: string,
  destPath: string
): Promise<string | null> => {
  const res = await fetch(url);
  if (!res.ok) {
    consola.warn(`Failed to download ${url}: ${res.status}`);
    return null;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buffer);
  return destPath;
};

const escapeYaml = (str: string): string => {
  if (!str) {
    return '""';
  }
  if (/[:'"#\n]/.test(str)) {
    return `"${str.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
  }
  return str;
};

const localeToFilename = (locale: string): string =>
  locale === "pt-BR" ? "pt-br" : "en";

const buildLookups = (posts: Post[], tags: Tag[], media: Media[]) => {
  const tagMap = new Map<string, string>();
  for (const tag of tags) {
    tagMap.set(tag.id, tag.name);
  }

  const mediaMap = new Map<string, Media>();
  for (const m of media) {
    mediaMap.set(m.id, m);
  }

  const postById = new Map<string, Post>();
  for (const post of posts) {
    postById.set(post.id, post);
  }

  const translationPair = new Map<string, string>();
  for (const post of posts) {
    if (post.translates && postById.has(post.translates)) {
      translationPair.set(post.id, post.translates);
      translationPair.set(post.translates, post.id);
    }
  }

  return { mediaMap, postById, tagMap, translationPair };
};

const groupPosts = (
  posts: Post[],
  postById: Map<string, Post>,
  translationPair: Map<string, string>
): Map<string, Post[]> => {
  const groups = new Map<string, Post[]>();
  const postToDir = new Map<string, string>();

  for (const post of posts) {
    if (postToDir.has(post.id)) {
      continue;
    }

    const partnerId = translationPair.get(post.id);
    const partner = partnerId ? postById.get(partnerId) : null;

    const dateStr = post.created.slice(0, 10);
    let { slug } = post;
    if (partner?.locale === "en-US") {
      ({ slug } = partner);
    }
    const dirSlug = `${dateStr}_${slug}`;

    const group: Post[] = [post];
    postToDir.set(post.id, dirSlug);

    if (partner && !postToDir.has(partner.id)) {
      group.push(partner);
      postToDir.set(partner.id, dirSlug);
    }

    groups.set(dirSlug, group);
  }

  return groups;
};

const downloadCover = async (
  apiBase: string,
  group: Post[],
  mediaMap: Map<string, Media>,
  postDir: string,
  dirSlug: string
): Promise<string | null> => {
  const firstWithImage = group.find((p) => p.featuredImage);
  if (!firstWithImage) {
    return null;
  }

  const mediaRecord = mediaMap.get(firstWithImage.featuredImage);
  if (!mediaRecord) {
    return null;
  }

  const ext = extname(mediaRecord.file) || ".jpg";
  const coverFilename = `cover${ext}`;
  const fileUrl = `${apiBase}/files/${mediaRecord.collectionId}/${mediaRecord.id}/${mediaRecord.file}`;

  consola.info(`Downloading: ${dirSlug}/${coverFilename}`);
  await downloadFile(fileUrl, join(postDir, coverFilename));

  return coverFilename;
};

const buildMarkdown = (
  post: Post,
  resolvedTags: string[],
  coverFilename: string | null
): string => {
  const yamlLines = [
    "---",
    `title: ${escapeYaml(post.title)}`,
    `slug: ${post.slug}`,
    `locale: ${post.locale}`,
    `created: ${post.created}`,
    `updated: ${post.updated}`,
  ];

  if (resolvedTags.length > 0) {
    yamlLines.push("tags:");
    for (const tag of resolvedTags) {
      yamlLines.push(`  - ${escapeYaml(tag)}`);
    }
  }

  if (coverFilename) {
    yamlLines.push(`cover: ./${coverFilename}`);
  }

  if (post.type) {
    yamlLines.push(`type: ${post.type}`);
  }

  yamlLines.push("---", "");
  return yamlLines.join("\n") + post.content;
};

const importPosts = async (apiBase: string, outDir: string): Promise<void> => {
  consola.start("Fetching data from Pocketbase...");

  const [posts, tags, media] = await Promise.all([
    fetchAllRecords<Post>(apiBase, "posts"),
    fetchAllRecords<Tag>(apiBase, "tags"),
    fetchAllRecords<Media>(apiBase, "media"),
  ]);

  const { tagMap, mediaMap, postById, translationPair } = buildLookups(
    posts,
    tags,
    media
  );
  const groups = groupPosts(posts, postById, translationPair);

  consola.info(`${groups.size} post directories (${posts.length} files total)`);

  for (const [dirSlug, group] of groups) {
    const postDir = join(outDir, dirSlug);
    await mkdir(postDir, { recursive: true });

    const coverFilename = await downloadCover(
      apiBase,
      group,
      mediaMap,
      postDir,
      dirSlug
    );

    for (const post of group) {
      const localeName = localeToFilename(post.locale);
      const resolvedTags = (post.tags || [])
        .map((id) => tagMap.get(id))
        .filter(Boolean) as string[];

      const markdown = buildMarkdown(post, resolvedTags, coverFilename);
      const filePath = join(postDir, `${localeName}.md`);
      await writeFile(filePath, markdown, "utf8");
      await utimes(filePath, new Date(post.created), new Date(post.updated));
    }
  }

  const paired = [...groups.values()].filter((g) => g.length > 1).length;
  const single = groups.size - paired;
  consola.success(`${groups.size} directories created`);
  consola.info(`  ${paired} bilingual (en + pt-br)`);
  consola.info(`  ${single} single-language`);
};

export default defineCommand({
  args: {
    out: {
      alias: "o",
      description: "Output directory for posts",
      type: "string",
    },
    url: {
      alias: "u",
      description: "Pocketbase API base URL",
      type: "string",
    },
    yes: {
      alias: "y",
      description: "Skip confirmation prompt",
      type: "boolean",
    },
  },
  meta: {
    description: "Import posts from a Pocketbase instance",
    name: "import",
  },
  async run({ args }) {
    const { isTTY } = process.stdout;

    const url =
      args.url ||
      (isTTY
        ? await consola.prompt("Pocketbase URL:", {
            default: "https://pocketbase.douglasmoura.dev",
            placeholder: "https://pocketbase.douglasmoura.dev",
            type: "text",
          })
        : "https://pocketbase.douglasmoura.dev");

    const out =
      args.out ||
      (isTTY
        ? await consola.prompt("Output directory:", {
            default: "content/posts",
            placeholder: "content/posts",
            type: "text",
          })
        : "content/posts");

    const apiBase = `${url.replace(/\/+$/, "")}/api`;
    const outDir = resolve(out);

    if (!args.yes && isTTY) {
      const confirmed = await consola.prompt(
        `Import posts from ${url} to ${outDir}?`,
        { initial: true, type: "confirm" }
      );

      if (!confirmed) {
        consola.info("Aborted.");
        return;
      }
    }

    await importPosts(apiBase, outDir);
  },
});
