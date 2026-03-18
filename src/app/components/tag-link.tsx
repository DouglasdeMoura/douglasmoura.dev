interface TagLinkProps {
  tag: string;
}

export const TagLink = ({ tag }: TagLinkProps) => (
  <a
    href={`/tag/${encodeURIComponent(tag)}`}
    className="inline-block lowercase text-xs tracking-[0.04em] text-text-muted bg-surface-1 py-1 px-2.5 rounded-md no-underline hover:bg-surface-2 hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
  >
    {tag}
  </a>
);
