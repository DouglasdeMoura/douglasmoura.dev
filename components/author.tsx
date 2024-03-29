import Link from 'next/link';
import __ from '../i18n/locales';
import Avatar from './avatar';

type AuthorProps = {
  name?: string;
}

export default function Author({ name = 'Douglas Moura' }: AuthorProps) {
  return (
    <span className="byline">
      <Avatar height={28} />
      <span className="author vcard">
        <span className="screen-reader-text">{__('by')}</span>
        <Link href="/">
          <a className="url fn n">
            {name}
          </a>
        </Link>
      </span>
    </span>
  );
}
