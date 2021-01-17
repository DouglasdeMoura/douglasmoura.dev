import Link from 'next/link'
import Image from 'next/image'
import DateFormatter from './date-formatter'

type Props = {
  title: string
  coverImage: string
  excerpt: string
  date: string
  slug: string
}

const PostExcerpt = ({
  title,
  coverImage,
  date,
  excerpt,
  slug
}: Props) => {
  return (
    <article className="excerpt mb-8 rounded-md">
      <Link as={`/blog/${slug}`} href="/blog/[slug]">
        <a className="flex gap-4">
          <figure>
            <Image src={coverImage} width={200} height={200} />
          </figure>
          <div>
            <h2 className="text-3xl mb-3 leading-snug">
              {title}

            </h2>
            <div className="text-lg mb-4 text-gray-600">
              <DateFormatter dateString={date} />
            </div>
            {excerpt}
          </div>
        </a>
      </Link>
    </article >
  )
}

export default PostExcerpt
