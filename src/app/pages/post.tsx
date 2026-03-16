import { PostSeo } from "#app/components/post-seo.js";
import { renderMarkdown } from "#app/lib/markdown.js";
import type { Post } from "#app/lib/posts.js";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

export const PostPage = async ({ post }: { post: Post }) => {
  const html = await renderMarkdown(post.body);

  return (
    <>
      <PostSeo post={post} siteUrl={SITE_URL} />
      <article lang={post.locale}>
        <header>
          <h1>{post.title}</h1>
          <time dateTime={post.created.slice(0, 10)}>
            {post.created.slice(0, 10)}
          </time>
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
