import Head from 'next/head';
import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import hydrate from 'next-mdx-remote/hydrate';
import renderToString from 'next-mdx-remote/render-to-string';
import { State, Observe } from '../components/observable';
import { ExemploPlanetas } from '../components/styled-components';
import DateTime from '../components/date-time';
import Template from '../components/template';
import __ from '../i18n/locales';
import Posts from '../lib/Posts';
import FeaturedImage from '../components/featured-image';
import ReadingTime from '../components/reading-time';
import Author from '../components/author';
import Share from '../components/share';
import Card from '../components/card';
import Comments from '../components/comments';
// import generateRSS from '../scripts/generateRSS';

const posts = new Posts(process.env.POSTS_DIRECTORY);
const components = { State, Observe, ExemploPlanetas };

export function getStaticPaths() {
  // generateRSS(posts.feed);

  return {
    paths: posts.all.map(post => ({ params: { ...post } })),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = posts.all.filter(post => post.slug === params.slug)[0];
  post.source = await renderToString(
    post.content,
    {
      components,
      mdxOptions: {
        remarkPlugins: [require('remark-prism')]
      }
    }
  );

  return {
    props: {
      siteInfo: {
        title: post.title,
        description: process.env.SITE_NAME,
      },
      post
    }
  }
}

export default function Slug({ siteInfo: { title, description }, post }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { query } = useRouter();
  const { id, date, modified, source, slug, featuredImage, excerpt } = post;
  const content = hydrate(source, { components });
  const cardURL = `https://douglasmoura.dev/uploads/${slug}/card.png`;

  if (!!query.card) {
    return <Card title={title} image={featuredImage} />
  }

  return (
    <Template
      title={title}
      description={description}
    >
      <Head>
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://douglasmoura.dev/${slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:site_name" content="Douglas Moura" />
        <meta name="twitter:site" content="@douglasdemoura" />
        <meta name="twitter:creator" content="@douglasdemoura" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:widgets:new-embed-design" content="on" />
        <meta name="twitter:image:src" content={cardURL} />
        <meta name="image" content={cardURL} />
        <meta itemProp="image" content={cardURL} />
        <meta property="og:image" content={cardURL} />
        <meta property="og:image:width" content="1686px" />
        <meta property="og:image:height" content="894px" />
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={`https://douglasmoura.dev/${slug}`} />
      </Head>
      <main id="primary" className="site-main single">
        <article id={`post-${id}`} className="hentry post">
          <header className="entry-header">
            <h1 className="entry-title">
              {title}
            </h1>
            <div className="entry-meta">
              <DateTime published={date} updated={modified} />
              {' '} · {' '}
              <ReadingTime content={source.renderedOutput} />
            </div>
          </header>
          <div className="entry-share">
            <Author />
            <Share />
          </div>

          {featuredImage &&
            <FeaturedImage
              src={featuredImage}
              layout="fill"
              alt={title}
            />
          }
          <div className="entry-content prose prose-2xl line-numbers">
            {content}
          </div>

          <hr />

          <footer className="entry-footer">
            <h2 className="comments-title">{__('Comments')}</h2>
            <Comments repo="DouglasdeMoura/comments" />
          </footer>
        </article>
      </main>
    </Template>
  )
}
