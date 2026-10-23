import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Translate as TranslateIcon } from "@phosphor-icons/react/dist/ssr/Translate";
import type { Tweet } from "react-tweet/api";

import { BalancedText } from "#app/components/balanced-text.js";
import { Breadcrumbs } from "#app/components/breadcrumbs.js";
import { CodeCopy } from "#app/components/code-copy.js";
import { PostSeo } from "#app/components/post-seo.js";
import { PrefetchLink } from "#app/components/prefetch-link.js";
import { TagLink } from "#app/components/tag-link.js";
import { TweetEmbed } from "#app/components/tweet-embed.js";
import { formatDate, t } from "#app/lib/i18n.js";
import { getPostAlternates } from "#app/lib/posts.js";
import type { AdjacentPosts, Post as PostType } from "#app/lib/posts.js";
import { SITE_URL } from "#app/lib/site.js";

const LOCALE_NAMES: Record<string, string> = {
  "en-US": "English",
  "pt-BR": "Português",
};

const TWEET_PLACEHOLDER_RE = /<div data-tweet-id="(?<id>\d+)"><\/div>/gu;

const PostBody = ({
  html,
  tweets,
}: {
  html: string;
  tweets: (Tweet | undefined)[];
}) => {
  if (tweets.length === 0) {
    return (
      /* oxlint-disable-next-line react/no-danger -- safe: rendering our own markdown, not user input */
      <div dangerouslySetInnerHTML={{ __html: html }} />
    );
  }

  const segments = html.split(TWEET_PLACEHOLDER_RE);

  return (
    <>
      {segments.map((segment, i) => {
        if (i % 2 === 1) {
          const tweetIndex = (i - 1) / 2;
          return (
            <TweetEmbed key={`tweet-${segment}`} tweet={tweets[tweetIndex]} />
          );
        }
        if (!segment) {
          return null;
        }
        /* oxlint-disable react/no-danger -- safe: rendering our own markdown, not user input */
        return (
          <div
            key={`segment-${segment.slice(0, 32)}`}
            dangerouslySetInnerHTML={{ __html: segment }}
          />
        );
        /* oxlint-enable react/no-danger */
      })}
    </>
  );
};

interface PostProps {
  post: Omit<PostType, "body" | "images">;
  html: string;
  hasMath: boolean;
  adjacent: AdjacentPosts;
  readingTime: number;
  tweets: (Tweet | undefined)[];
  howToSchema?: Record<string, unknown> | null;
}

export const Post = ({
  post,
  html,
  hasMath,
  adjacent,
  readingTime,
  tweets,
  howToSchema,
}: PostProps) => {
  const alternates = getPostAlternates(post.slug);
  const alternate = alternates.find((a) => a.locale !== post.locale);

  return (
    <>
      <PostSeo
        post={post}
        siteUrl={SITE_URL}
        alternates={alternates}
        howToSchema={howToSchema}
      />
      {hasMath && <link rel="stylesheet" href="/katex/katex.min.css" />}
      <article lang={post.locale} className="prose mx-auto px-4 py-10">
        <Breadcrumbs
          items={[{ href: "/", label: t("Home") }, { label: post.title }]}
        />
        <header className="not-prose mb-10">
          <h1 className="text-text-strong text-4xl leading-[1.15] font-bold tracking-tight">
            <BalancedText>{post.title}</BalancedText>
          </h1>
          <p className="text-text-muted mt-3 text-sm tracking-wide">
            <time dateTime={post.created} itemProp="datePublished">
              {t("Published on")} {formatDate(post.created)}
            </time>
            {" · "}
            {readingTime} {t("min. read")}
          </p>
          {post.updated &&
            post.updated.slice(0, 10) !== post.created.slice(0, 10) && (
              <time
                dateTime={post.updated}
                itemProp="dateModified"
                className="text-text-muted mt-1 block text-sm tracking-wide"
              >
                {t("Last updated on")} {formatDate(post.updated)}
              </time>
            )}
          {alternate && (
            <a
              href={`/${alternate.slug}`}
              lang={alternate.locale}
              hrefLang={alternate.locale}
              className="text-text hover:text-text-strong mt-4 inline-flex items-center gap-1.5 text-sm no-underline motion-safe:transition-colors motion-safe:duration-150"
            >
              <TranslateIcon size={16} />
              {t("Also available in")}{" "}
              <span className="decoration-border hover:decoration-text-strong underline underline-offset-2">
                {LOCALE_NAMES[alternate.locale]}
              </span>
            </a>
          )}
        </header>
        {post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            width={900}
            height={600}
            className="not-prose border-border bg-surface-1 mb-10 aspect-3/2 w-full rounded-xl border object-cover"
          />
        )}
        <CodeCopy />
        <PostBody html={html} tweets={tweets} />
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
            className="not-prose border-border grid grid-cols-2 gap-4 border-t pt-8"
          >
            {adjacent.prev ? (
              <PrefetchLink
                href={`/${adjacent.prev.slug}`}
                className="group flex flex-col gap-1 no-underline"
              >
                <span className="text-text-muted flex items-center gap-1 text-xs tracking-wide uppercase">
                  <ArrowLeftIcon
                    size={14}
                    className="group-hover:-translate-x-0.5 motion-safe:transition-transform motion-safe:duration-150"
                  />
                  {t("Previous")}
                </span>
                <span className="text-text-muted group-hover:text-text-strong text-sm font-medium motion-safe:transition-colors motion-safe:duration-150">
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
                <span className="text-text-muted flex items-center gap-1 text-xs tracking-wide uppercase">
                  {t("Next")}
                  <ArrowRightIcon
                    size={14}
                    className="group-hover:translate-x-0.5 motion-safe:transition-transform motion-safe:duration-150"
                  />
                </span>
                <span className="text-text-muted group-hover:text-text-strong text-sm font-medium motion-safe:transition-colors motion-safe:duration-150">
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
