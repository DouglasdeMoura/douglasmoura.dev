import Link from 'next/link'
import cn from 'classnames'

type Props = {
  title: string
  src: string
  slug?: string
}

const CoverImage = ({ title, src, slug }: Props) => {
  const image = (
    <img
      src={src}
      alt={title}
      className={cn('shadow-small rounded-md', {
        'hover:shadow-medium transition-shadow duration-200': slug
      })}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug
        ? (
          <Link as={`/blog/${slug}`} href="/blog/[slug]">
            <a aria-label={title}>{image}</a>
          </Link>
          )
        : (
            image
          )}
    </div>
  )
}

export default CoverImage
