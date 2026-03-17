import { PostSeo } from "#app/components/post-seo.js";
import { formatDate, t } from "#app/lib/i18n.js";
import { renderMarkdown } from "#app/lib/markdown.js";
import { getPostAlternates } from "#app/lib/posts.js";
import type { Post as PostType } from "#app/lib/posts.js";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

interface PostProps {
  post: PostType;
}

export const Post = async ({ post }: PostProps) => {
  const html = await renderMarkdown(post.body);

  return (
    <>
      <PostSeo
        post={post}
        siteUrl={SITE_URL}
        alternates={getPostAlternates(post.slug)}
      />
      <article lang={post.locale} className="prose mx-auto px-4 py-8">
        <header className="not-prose mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-strong leading-tight">
            {post.title}
          </h1>
          <time
            dateTime={post.created}
            itemProp="datePublished"
            className="mt-3 block text-sm text-text-muted tracking-wide"
          >
            {t("Published on")} {formatDate(post.created)}
          </time>
          {post.updated && post.updated !== post.created && (
            <time
              dateTime={post.updated}
              itemProp="dateModified"
              className="mt-1 block text-sm text-text-muted tracking-wide"
            >
              {t("Last updated on")} {formatDate(post.updated)}
            </time>
          )}
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="inline-block text-xs tracking-[0.04em] text-text-muted bg-surface-1 py-1 px-2.5 rounded-full no-underline hover:bg-surface-2 hover:text-text-strong transition-colors duration-150"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}
        </header>
        {/* oxlint-disable-next-line eslint-plugin-react(no-danger) -- safe: rendering our own markdown, not user input */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </>
  );
};
