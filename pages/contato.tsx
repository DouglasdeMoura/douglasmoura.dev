import Head from 'next/head'
import Container from '../components/container'
import Layout from '../components/layout'
import { SITE_NAME } from '../lib/constants'
import Header from '../components/header'
import markdownStyles from '../styles/markdown-styles.module.css'
import ContactForm from '../components/contact-form'

const Contato = () => {
  return (
    <>
      <Head>
        <title>Sobre | {SITE_NAME}</title>
      </Head>
      <Layout>
        <Header />
        <Container>
          <main>
            <article className="mb-32">
              <h1 className="text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
                Contato
              </h1>
              <div className="entry-content">
                <div className={markdownStyles.markdown}>
                  <ContactForm />
                </div>
              </div>
            </article>
          </main>
        </Container>
      </Layout>
    </>
  )
}

export default Contato
