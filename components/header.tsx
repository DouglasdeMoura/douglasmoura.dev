import Container from '../components/container'
import Link from 'next/link'
import Intro from './intro'

type Props = {
  home?: boolean
}

const Header = ({ home = false }: Props) => {
  const headerClasses = 'text-2xl font-bold tracking-tight md:tracking-tighter leading-tight'
  const headerLink = (
    <Link href="/">
      <a className="hover:underline">Douglas Moura</a>
    </Link>
  )

  return (
    <Container>
      <header className="mb-10 pb-10 pt-8 flex gap-4 text-base items-center justify-between border-b border-accent-7">
        <div className="site-branding">
          {
            home
              ? <h1 className={`${headerClasses} sr-only`}>{headerLink}</h1>
              : <p className={headerClasses}>{headerLink}</p>
          }
        </div>
        <nav className="main-navigation flex gap-4">
          <Link href="/">
            <a className="hover:underline">Início</a>
          </Link>
          <Link href="/blog">
            <a className="hover:underline">Blog</a>
          </Link>
          <Link href="/sobre">
            <a className="hover:underline">Sobre</a>
          </Link>
          <Link href="/contato">
            <a className="hover:underline">Contato</a>
          </Link>
        </nav>
      </header>
      {home && <Intro />}
    </Container>
  )
}

export default Header
