import { InferGetStaticPropsType, GetStaticProps } from 'next';
import DateTime from '../components/date-time';
import Template from '../components/template';
import __ from '../i18n/locales';
import Posts from '../lib/Posts';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import FeaturedImage from '../components/featured-image';

const posts = new Posts(process.env.POSTS_DIRECTORY);

export function getStaticPaths() {
  return {
    paths: posts.all.map(post => ({ params: { ...post } })),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = posts.all.filter(post => post.slug === params.slug)[0];
  post.source = await renderToString(post.content);

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
  const { id, date, modified, source, featuredImage } = post;
  const content = hydrate(source);

  return (
    <Template
      title={title}
      description={description}
      isHome={true}
    >
      <main id="primary" className="site-main single">
        <article id={`post-${id}`} className="hentry post">
          <header className="entry-header">
            <h1 className="entry-title">
              {title}
            </h1>
            <div className="entry-meta">
              <DateTime published={date} updated={modified} />
            </div>
          </header>
          {featuredImage &&
            <FeaturedImage
              src={featuredImage}
              layout="fill"
              alt={title}
            />
          }
          <div className="entry-content prose prose-2xl">
            {content}
          </div>
        </article>
      </main>
    </Template>
  )
}
