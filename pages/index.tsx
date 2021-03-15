import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'react-zondicons';
import Excerpt from '../components/excerpt';
import Hero from '../components/hero';
import Template from '../components/template';
import __, { getLocale } from '../i18n/locales';
import Posts from '../lib/Posts';

export async function getStaticProps() {
  const siteInfo = {
    title: process.env.SITE_NAME,
    description: process.env.SITE_DESCRIPTION,
  };

  const posts = new Posts(process.env.POSTS_DIRECTORY);

  return {
    props: {
      siteInfo,
      posts: posts.all
    },
  }
}

export default function Index({ siteInfo: { title, description }, posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Template
      title={title}
      description={description}
      isHome={true}
    >
      <Hero />
      <main id="primary" className="site-main featured-posts-container">
        <header className="screen-reader-text">
          <h1>Blog</h1>
        </header>
        <div className="featured-posts">
          {posts.filter(post => post.locale === getLocale()).map(post => <Excerpt {...post} key={post.id} />)}
        </div>
        {posts.length > 20 &&
          <nav className="post-navigation">
            <Link href="/blog">
              <a className="button arrow next">
                <span className="screen-reader-text">{__('See all posts')}</span> <ArrowRight size={16} />
              </a>
            </Link>
          </nav>
        }
      </main>
    </Template>
  )
}
