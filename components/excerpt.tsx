import Image from 'next/image';
import Link from 'next/link';
import __ from '../i18n/locales';
import DateTime from './date-time';
import FeaturedImage from './featured-image';
import ReadingTime from './reading-time';

interface IExcerptProps {
  id: string;
  date: string;
  modified: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
}

export default function Excerpt({
  id,
  date,
  modified,
  content,
  slug,
  excerpt,
  title,
  featuredImage,
}: IExcerptProps) {
  return (
    <article id={`post-${id}`} className="hentry post excerpt">
      <header className="entry-header">
        <h2 className="entry-title">
          <Link href={`/${slug}`}>
            <a>
              <span>{title}</span>
            </a>
          </Link>
        </h2>
        <div className="entry-meta">
          <Link href={`/${slug}`}>
            <a>
              <DateTime published={date} updated={modified} />
            </a>
          </Link>
        </div>
      </header>
      {featuredImage &&
        <Link href={`/${slug}`}>
          <a>
            <FeaturedImage
              src={featuredImage}
              layout="fill"
              alt={title}
            />
          </a>
        </Link>
      }
      {excerpt && <div className="entry-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />}
      <footer className="entry-footer">
        <Link href={`/${slug}`}>
          <a className="read-more">
            {__('Read More')}
          </a>
        </Link>
        ·
        <Link href={`/${slug}`}>
          <a className="read-more">
            <ReadingTime content={content} />
          </a>
        </Link>
      </footer>
    </article>
  );
}
