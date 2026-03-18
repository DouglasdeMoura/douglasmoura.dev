import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Translate as TranslateIcon } from "@phosphor-icons/react/dist/ssr/Translate";

import { PostSeo } from "#app/components/post-seo.js";
import { PrefetchLink } from "#app/components/prefetch-link.js";
import { TagLink } from "#app/components/tag-link.js";
import { formatDate, t } from "#app/lib/i18n.js";
import { getPostAlternates } from "#app/lib/posts.js";
import type { AdjacentPosts, Post as PostType } from "#app/lib/posts.js";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

const LOCALE_NAMES: Record<string, string> = {
  "en-US": "English",
  "pt-BR": "Português",
};

interface PostProps {
  post: Omit<PostType, "body">;
  html: string;
  adjacent: AdjacentPosts;
}

export const Post = ({ post, html, adjacent }: PostProps) => {
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
          {post.updated &&
            post.updated.slice(0, 10) !== post.created.slice(0, 10) && (
              <time
                dateTime={post.updated}
                itemProp="dateModified"
                className="mt-1 block text-sm text-text-muted tracking-wide"
              >
                {t("Last updated on")} {formatDate(post.updated)}
              </time>
            )}
          {alternate && (
            <a
              href={`/${alternate.slug}`}
              lang={alternate.locale}
              hrefLang={alternate.locale}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-text no-underline hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
            >
              <TranslateIcon size={16} />
              {t("Also available in")}{" "}
              <span className="underline underline-offset-2 decoration-border hover:decoration-text-strong">
                {LOCALE_NAMES[alternate.locale]}
              </span>
            </a>
          )}
        </header>
        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="not-prose mb-10 w-full aspect-[3/2] rounded-xl border border-border bg-surface-1 object-cover"
          />
        )}
        {/* oxlint-disable-next-line eslint-plugin-react(no-danger) -- safe: rendering our own markdown, not user input */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {post.tags.length > 0 && (
          <div className="not-prose mt-16 mb-8 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagLink key={tag} tag={tag} />
            ))}
          </div>
        )}
        {(adjacent.prev || adjacent.next) && (
          <nav
            aria-label={t("Pagination")}
            className="not-prose border-t border-border pt-8 grid grid-cols-2 gap-4"
          >
            {adjacent.prev ? (
              <PrefetchLink
                href={`/${adjacent.prev.slug}`}
                className="group flex flex-col gap-1 no-underline"
              >
                <span className="flex items-center gap-1 text-xs tracking-wide text-text-muted uppercase">
                  <ArrowLeftIcon
                    size={14}
                    className="motion-safe:transition-transform motion-safe:duration-150 group-hover:-translate-x-0.5"
                  />
                  {t("Previous")}
                </span>
                <span className="text-sm font-medium text-text-muted group-hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150">
                  {adjacent.prev.title}
                </span>
              </PrefetchLink>
            ) : (
              <span />
            )}
            {adjacent.next ? (
              <PrefetchLink
                href={`/${adjacent.next.slug}`}
                className="group flex flex-col items-end gap-1 text-right no-underline"
              >
                <span className="flex items-center gap-1 text-xs tracking-wide text-text-muted uppercase">
                  {t("Next")}
                  <ArrowRightIcon
                    size={14}
                    className="motion-safe:transition-transform motion-safe:duration-150 group-hover:translate-x-0.5"
                  />
                </span>
                <span className="text-sm font-medium text-text-muted group-hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150">
                  {adjacent.next.title}
                </span>
              </PrefetchLink>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </>
  );
};
