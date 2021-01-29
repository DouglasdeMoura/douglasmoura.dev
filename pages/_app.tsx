import { AppProps } from 'next/app'
import '../styles/index.css'
import '../styles/dracula-prism.css'

export default function MyApp ({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
