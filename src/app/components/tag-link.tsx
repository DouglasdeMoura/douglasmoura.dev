import { getLocale } from "#app/lib/i18n.js";
import { slugifyTag } from "#app/lib/posts.js";
import { localePathPrefix } from "#app/lib/site.js";

interface TagLinkProps {
  tag: string;
}

export const TagLink = ({ tag }: TagLinkProps) => {
  const locale = getLocale();
  const prefix = localePathPrefix(locale);

  return (
    <a
      href={`${prefix}/tag/${slugifyTag(tag)}`}
      className="text-text-muted bg-surface-1 hover:bg-surface-2 hover:text-text-strong inline-block rounded-md px-2.5 py-1 text-xs tracking-[0.04em] lowercase no-underline active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
    >
      {tag}
    </a>
  );
};
