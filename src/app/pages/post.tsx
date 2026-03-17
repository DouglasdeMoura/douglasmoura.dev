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
      <article
        lang={post.locale}
        className="prose dark:prose-invert mx-auto px-6 py-4"
      >
        <header>
          <h1>{post.title}</h1>
          <time dateTime={post.created} itemProp="datePublished">
            {t("Published on")} {formatDate(post.created)}
          </time>
          {post.updated && post.updated !== post.created && (
            <time
              dateTime={post.updated}
              itemProp="dateModified"
              className="sr-only"
            >
              {t("Last updated on")} {formatDate(post.updated)}
            </time>
          )}
          {post.tags.length > 0 && (
            <ul>
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </header>
        {/* oxlint-disable-next-line eslint-plugin-react(no-danger) -- safe: rendering our own markdown, not user input */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </>
  );
};
