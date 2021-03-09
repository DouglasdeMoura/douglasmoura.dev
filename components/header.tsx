import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import __ from '../i18n/locales';
import isHome from '../utils/isHome';

export default function Header() {
  const { locale } = useRouter();

  const localizedLink = (adress) => {
    const prefix = locale === 'en' ? '/en' : '';
    return `${prefix}${adress}`;
  }

  const siteTitle = <Link href="/"><a rel="home">{process.env.SITE_NAME}</a></Link>;

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href={`https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap`} rel="stylesheet" />
      </Head>
      <a className="skip-link screen-reader-text" href="#primary">
        {__('Skip to content')}
      </a>
      <header id="masthead" className="site-header">
        <div className="container">
          <div className="site-branding">
            {isHome() ? <h1 className="site-title">{siteTitle}</h1> : <p className="site-title">{siteTitle}</p>}
          </div>
          <nav id="site-navigation" className="main-navigation">
            <div id="primary-menu" className="site-navigation">
              <ul role="list">
                <li>
                  <Link href={localizedLink('/')}>
                    <a>
                      {__('Home')}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={localizedLink('/')}>
                    <a>
                      {__('About')}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={localizedLink('/')}>
                    <a>
                      {__('Contact')}
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
