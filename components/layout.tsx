
import { ReactNode } from 'react'
import Footer from './footer'
import Meta from './meta'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen bg-black">
        {children}
        <Footer />
      </div>
    </>
  )
}

export default Layout
