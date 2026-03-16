import { PostSeo } from "#app/components/post-seo.js";
import { formatDate, getDateLabel } from "#app/lib/format-date.js";
import { renderMarkdown } from "#app/lib/markdown.js";
import type { Post as PostType } from "#app/lib/posts.js";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

interface PostProps {
  post: PostType;
}

export const Post = async ({ post }: PostProps) => {
  const html = await renderMarkdown(post.body);

  return (
    <>
      <PostSeo post={post} siteUrl={SITE_URL} />
      <article lang={post.locale}>
        <header>
          <h1>{post.title}</h1>
          <time dateTime={post.created} itemProp="datePublished">
            {getDateLabel("published", post.locale)}{" "}
            {formatDate(post.created, post.locale)}
          </time>
          {post.updated && post.updated !== post.created && (
            <time dateTime={post.updated} itemProp="dateModified">
              {getDateLabel("updated", post.locale)}{" "}
              {formatDate(post.updated, post.locale)}
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
