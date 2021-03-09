import { useRouter } from 'next/router';
import { format, formatRFC3339 } from 'date-fns';
import ptLocale from 'date-fns/locale/pt-BR';
import __ from '../i18n/locales';

interface IDateTimeProps {
  published: string;
  updated?: string;
}

export default function DateTime({ published, updated }: IDateTimeProps) {
  const { locale } = useRouter();
  const options = locale === 'en' ? {} : { locale: ptLocale };
  const publishedFormatted = format(new Date(published), __('MMMM, LL y'), options);
  const publishedDatetime = formatRFC3339(new Date(published));
  const updatedDatetime = formatRFC3339(new Date(updated));

  return (
    <span className="posted-on">
      <span className="screen-reader-text">{__('Posted on')} {' '}</span>
      {published === updated
        ?
        <time className="entry-date published updated" dateTime={publishedDatetime}>
          {publishedFormatted}
        </time>
        :
        <>
          <time className="entry-date published" dateTime={publishedDatetime}>
            {publishedFormatted}
          </time>
          <span className="screen-reader-text">{__('Updated at')}
            <time className="updated" dateTime={updatedDatetime}>%4$s</time>
          </span>
        </>
      }
    </span>
  );
}
