import { Translate as TranslateIcon } from "@phosphor-icons/react/dist/ssr/Translate";

import { PostSeo } from "#app/components/post-seo.js";
import { formatDate, t } from "#app/lib/i18n.js";
import { renderMarkdown } from "#app/lib/markdown.js";
import { getPostAlternates } from "#app/lib/posts.js";
import type { Post as PostType } from "#app/lib/posts.js";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

const LOCALE_NAMES: Record<string, string> = {
  "en-US": "English",
  "pt-BR": "Português",
};

interface PostProps {
  post: PostType;
}

export const Post = async ({ post }: PostProps) => {
  const html = await renderMarkdown(post.body);
  const alternates = getPostAlternates(post.slug);
  const alternate = alternates.find((a) => a.locale !== post.locale);

  return (
    <>
      <PostSeo post={post} siteUrl={SITE_URL} alternates={alternates} />
      <article lang={post.locale} className="prose mx-auto px-4 py-10">
        <header className="not-prose mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-text-strong leading-[1.15]">
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
                  className="inline-block lowercase text-xs tracking-[0.04em] text-text-muted bg-surface-1 py-1 px-2.5 rounded-full no-underline hover:bg-surface-2 hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}
          {alternate && (
            <a
              href={`/${alternate.slug}`}
              lang={alternate.locale}
              hrefLang={alternate.locale}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-text-muted no-underline hover:text-text-strong motion-safe:transition-color motion-safe:duration-150"
            >
              <TranslateIcon size={16} />
              {t("Also available in")}{" "}
              <span className="underline underline-offset-2">
                {LOCALE_NAMES[alternate.locale]}
              </span>
            </a>
          )}
        </header>
        {/* oxlint-disable-next-line eslint-plugin-react(no-danger) -- safe: rendering our own markdown, not user input */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </>
  );
};
