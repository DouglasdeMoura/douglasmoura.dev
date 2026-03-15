/**
 * Downloads all blog posts from Pocketbase and creates markdown files
 * organized by post directory with locale-named files.
 *
 * Structure:
 *   content/posts/{date}_{slug}/en.md
 *   content/posts/{date}_{slug}/pt-br.md
 *   content/posts/{date}_{slug}/cover.{ext}
 *
 * Translations share the same directory. The directory name uses the
 * English slug when available, otherwise the Portuguese slug.
 *
 * Usage: node scripts/download-blog.mjs
 */

import { mkdir, utimes, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const BASE_URL = "https://pocketbase.douglasmoura.dev";
const API = `${BASE_URL}/api`;
const POSTS_DIR = join(import.meta.dirname, "..", "content", "posts");

const fetchAllRecords = async (collection) => {
  const records = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${API}/collections/${collection}/records?perPage=200&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${collection} page ${page}: ${res.status}`
      );
    }
    const data = await res.json();
    records.push(...data.items);
    ({ totalPages } = data);
    page += 1;
  }

  console.log(`Fetched ${records.length} ${collection} records`);
  return records;
};

const downloadFile = async (url, destPath) => {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Failed to download ${url}: ${res.status}`);
    return null;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buffer);
  return destPath;
};

const escapeYaml = (str) => {
  if (!str) {
    return '""';
  }
  if (/[:'"#\n]/.test(str)) {
    return `"${str.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
  }
  return str;
};

const localeToFilename = (locale) => (locale === "pt-BR" ? "pt-br" : "en");

const buildLookups = (posts, tags, media) => {
  const tagMap = new Map();
  for (const tag of tags) {
    tagMap.set(tag.id, tag.name);
  }

  const mediaMap = new Map();
  for (const m of media) {
    mediaMap.set(m.id, m);
  }

  const postById = new Map();
  for (const post of posts) {
    postById.set(post.id, post);
  }

  // Bidirectional translation map (API links can be one-way)
  const translationPair = new Map();
  for (const post of posts) {
    if (post.translates && postById.has(post.translates)) {
      translationPair.set(post.id, post.translates);
      translationPair.set(post.translates, post.id);
    }
  }

  return { mediaMap, postById, tagMap, translationPair };
};

const groupPosts = (posts, postById, translationPair) => {
  const groups = new Map();
  const postToDir = new Map();

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

    const group = [post];
    postToDir.set(post.id, dirSlug);

    if (partner && !postToDir.has(partner.id)) {
      group.push(partner);
      postToDir.set(partner.id, dirSlug);
    }

    groups.set(dirSlug, group);
  }

  return groups;
};

const downloadCover = async (group, mediaMap, postDir, dirSlug) => {
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
  const fileUrl = `${API}/files/${mediaRecord.collectionId}/${mediaRecord.id}/${mediaRecord.file}`;

  console.log(`  Downloading: ${dirSlug}/${coverFilename}`);
  await downloadFile(fileUrl, join(postDir, coverFilename));

  return coverFilename;
};

const buildMarkdown = (post, resolvedTags, coverFilename) => {
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

const [posts, tags, media] = await Promise.all([
  fetchAllRecords("posts"),
  fetchAllRecords("tags"),
  fetchAllRecords("media"),
]);

const { tagMap, mediaMap, postById, translationPair } = buildLookups(
  posts,
  tags,
  media
);
const groups = groupPosts(posts, postById, translationPair);

console.log(
  `\n${groups.size} post directories (${posts.length} files total)\n`
);

for (const [dirSlug, group] of groups) {
  const postDir = join(POSTS_DIR, dirSlug);
  await mkdir(postDir, { recursive: true });

  const coverFilename = await downloadCover(group, mediaMap, postDir, dirSlug);

  for (const post of group) {
    const localeName = localeToFilename(post.locale);
    const resolvedTags = (post.tags || [])
      .map((id) => tagMap.get(id))
      .filter(Boolean);

    const markdown = buildMarkdown(post, resolvedTags, coverFilename);
    const filePath = join(postDir, `${localeName}.md`);
    await writeFile(filePath, markdown, "utf8");
    await utimes(filePath, new Date(post.created), new Date(post.updated));

    console.log(`Created: ${dirSlug}/${localeName}.md`);
  }
}

const paired = [...groups.values()].filter((g) => g.length > 1).length;
const single = groups.size - paired;
console.log(`\nDone! ${groups.size} directories created`);
console.log(`  - ${paired} bilingual (en + pt-br)`);
console.log(`  - ${single} single-language`);
