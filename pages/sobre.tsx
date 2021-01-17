import Head from 'next/head'
import Container from '../components/container'
import Layout from '../components/layout'
import { SITE_NAME } from '../lib/constants'
import Header from '../components/header'
import markdownStyles from '../styles/markdown-styles.module.css'

const Sobre = () => {
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
              <h1 className="text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">Sobre</h1>
              <div className="entry-content">
                <div className={markdownStyles.markdown}>
                  <p>
                    Meu nome é Douglas Moura e sou um engenheiro de software de São Paulo. Sou graduado em Engenharia Civil pela Universidade Anhembi Morumbi e estou cursando a pós-graduação em Gestão de Projetos pela Universidade Presbiteriana Mackenzie. Além disso, fiz o curso de extensão de <a href="https://engsoftmoderna.info/" target="_blank" rel="noreferrer">Engenharia de Software Moderna</a> da Universidade Federal de Minas Gerais.
                  </p>
                  <p>
                    Atualmente, meu trabalho consiste no desenvolvimento de aplicações com React, Nest, Mithril e WeChat Miniprograms.
                  </p>
                  <p>
                    Conheça mais sobre a minha trajetória profissional no <a href="https://www.linkedin.com/in/dougmoura/" target="_blank" rel="noreferrer">LinkedIn</a> e no meu <a href="https://github.com/douglasdemoura" target="_blank" rel="noreferrer">GitHub</a>.
                  </p>
                </div>
              </div>
            </article>
          </main>
        </Container>
      </Layout>
    </>
  )
}

export default Sobre
