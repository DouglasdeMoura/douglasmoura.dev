import { create, insertMultiple, search } from "@orama/orama";
import { stemmer as enStemmer } from "@orama/stemmers/english";
import { stemmer as ptStemmer } from "@orama/stemmers/portuguese";

import { getAllPosts } from "#app/lib/posts.js";

const schema = {
  body: "string" as const,
  created: "string" as const,
  description: "string" as const,
  slug: "string" as const,
  tags: "string[]" as const,
  title: "string" as const,
};

const buildIndex = async (
  locale: "en-US" | "pt-BR",
  stemmer: typeof enStemmer
) => {
  const db = create({
    components: {
      tokenizer: { stemmer, stemming: true },
    },
    schema,
  });

  const posts = getAllPosts().filter((p) => p.locale === locale);
  await insertMultiple(
    db,
    posts.map((p) => ({
      body: p.body,
      created: p.created,
      description: p.description,
      slug: p.slug,
      tags: p.tags,
      title: p.title,
    }))
  );

  return db;
};

const indexes = {
  "en-US": await buildIndex("en-US", enStemmer),
  "pt-BR": await buildIndex("pt-BR", ptStemmer),
};

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  created: string;
}

export const searchPosts = async (
  query: string,
  locale: "en-US" | "pt-BR" = "en-US",
  limit = 10,
  offset = 0
): Promise<{ results: SearchResult[]; count: number }> => {
  const db = indexes[locale];
  const { hits, count } = await search(db, {
    limit,
    offset,
    properties: ["title", "body", "tags", "description"],
    term: query,
  });

  return {
    count,
    results: hits.map((hit) => ({
      created: hit.document.created as string,
      description: hit.document.description as string,
      slug: hit.document.slug as string,
      tags: hit.document.tags as string[],
      title: hit.document.title as string,
    })),
  };
};
