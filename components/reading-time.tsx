import __ from '../i18n/locales';

interface IReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
}

export default function ReadingTime({ content, wordsPerMinute = 340 }: IReadingTimeProps) {
  const readingTime = () => {
    const estimatedReadingTime = +(content.split(' ').length / wordsPerMinute).toFixed(0);

    if (estimatedReadingTime > 1)
      return __('{0} minutes').replace('{0}', estimatedReadingTime);

    if (estimatedReadingTime === 1)
      return __('1 minute');

    if (estimatedReadingTime < 1)
      return __('Less than a minute');
  }

  return (
    <span className="estimated-reading-time">
      {readingTime()}
    </span>
  );
}
