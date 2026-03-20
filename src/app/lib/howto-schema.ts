import type { Post } from "#app/lib/posts.js";

interface HowToStep {
  "@type": "HowToStep";
  name: string;
  position: number;
  text: string;
}

const HEADING_REGEX = /^## (.+)$/gm;

export const isHowToPost = (post: Pick<Post, "tags">): boolean =>
  post.tags.some((tag) => tag.toLowerCase() === "tutorial");

export const buildHowToSchema = (
  post: Pick<Post, "title" | "description" | "cover" | "body" | "tags">,
  siteUrl: string
): Record<string, unknown> | null => {
  if (!isHowToPost(post)) {
    return null;
  }

  const matches = [...post.body.matchAll(HEADING_REGEX)];
  const steps: HowToStep[] = matches.map((match, index) => ({
    "@type": "HowToStep" as const,
    name: match[1].trim(),
    position: index + 1,
    text: match[1].trim(),
  }));

  if (steps.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    description: post.description,
    name: post.title,
    step: steps,
    ...(post.cover && { image: `${siteUrl}${post.cover}` }),
  };
};
