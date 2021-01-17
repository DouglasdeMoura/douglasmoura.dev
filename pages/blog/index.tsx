import Head from 'next/head'
import Container from '../../components/container'
import Layout from '../../components/layout'
import { getAllPosts } from '../../lib/api'
import { SITE_NAME } from '../../lib/constants'
import Post from '../../types/post'
import Header from '../../components/header'
import PostExcerpt from '../../components/post-excerpt'

type Props = {
  posts: Post[]
}

const Blog = ({ posts }: Props) => {
  return (
    <>
      <Head>
        <title>Blog | {SITE_NAME}</title>
      </Head>
      <Layout>
        <Header />
        <main>
          <Container>
            {
              posts.length > 0 && posts.map(post => (
                <PostExcerpt
                  key={post.title}
                  title={post.title}
                  coverImage={post.coverImage}
                  date={post.date}
                  slug={post.slug}
                  excerpt={post.excerpt}
                />
              ))
            }
          </Container>
        </main>
      </Layout>
    </>
  )
}

export default Blog

export const getStaticProps = async () => {
  const posts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'excerpt',
    'coverImage'
  ])

  return {
    props: { posts }
  }
}
