import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';

interface IIndexProps {
  children: ReactNode;
  title: string;
  description: string;
  isHome?: boolean;
}

export default function Template({ children, title, description, isHome = false }: IIndexProps) {
  return (
    <div id="page" className="site">
      <Head>
        <title>{title} | {description}</title>
      </Head>
      <Header />
      <main id="primary" className="site-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
