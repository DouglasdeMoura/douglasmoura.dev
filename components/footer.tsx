import SocialLogo from 'social-logos';
import { FaRss } from 'react-icons/fa';

function Wave() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" fill="url(#wave-gradient) #447799;">
      <defs>
        <linearGradient id="wave-gradient">
          <stop stopColor="var(--color-lime-500)" offset="0%" />
          <stop stopColor="var(--color-green-700)" offset="100%" />
        </linearGradient>
      </defs>
      <path
        d="M0 0l30 48c30 48 90 144 150 192s120 48 180 37.3c60-10.3 120-32.3 180-58.6 60-26.7 120-58.7 180-64 60-5.7 120 16.3 180 16 60 .3 120-21.7 180-26.7s120 5 180-16 120-75 150-101.3L1440 0v320H0z"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer id="colophon" className="site-footer">
      <aside className="social-links">
        <header className="screen-reader-text">
          <h1>Entre em contato</h1>
        </header>
        <ul>
          <li>
            <a href="https://instagram.com/douglasdemoura" target="_blank">
              <SocialLogo icon="instagram" size={32} />
              <span className="screen-reader-text">/douglasdemoura</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/douglasdemoura" target="_blank">
              <SocialLogo icon="github" size={32} />
              <span className="screen-reader-text">/douglasdemoura</span>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/douglasdemoura" target="_blank">
              <SocialLogo icon="twitter" size={32} />
              <span className="screen-reader-text">/douglasdemoura</span>
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/dougmoura/" target="_blank">
              <SocialLogo icon="linkedin" size={32} />
              <span className="screen-reader-text">/in/douglasdemoura</span>
            </a>
          </li>
          <li>
            <a href="/rss.xml" target="_blank">
              <FaRss size={26} />
              <span className="screen-reader-text">RSS</span>
            </a>
          </li>
        </ul>
      </aside>
      <div className="wave">
        <Wave />
      </div>
    </footer>
  );
}
