import { getLocale } from "#app/lib/i18n.js";
import { slugifyTag } from "#app/lib/posts.js";

interface TagLinkProps {
  tag: string;
}

export const TagLink = ({ tag }: TagLinkProps) => {
  const locale = getLocale();
  const prefix = locale === "pt-BR" ? "/pt-BR" : "";

  return (
    <a
      href={`${prefix}/tag/${slugifyTag(tag)}`}
      className="inline-block lowercase text-xs tracking-[0.04em] text-text-muted bg-surface-1 py-1 px-2.5 rounded-md no-underline hover:bg-surface-2 hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
    >
      {tag}
    </a>
  );
};
