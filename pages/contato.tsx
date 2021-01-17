import Head from 'next/head'
import Container from '../components/container'
import Layout from '../components/layout'
import { SITE_NAME } from '../lib/constants'
import Header from '../components/header'
import markdownStyles from '../styles/markdown-styles.module.css'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useState } from 'react'

type ContactForm = {
  email: string
  message: string
}

const Contato = () => {
  const [serverState, setServerState] = useState()

  const handleServerResponse = (ok, msg) => {
    setServerState({ ok, msg })
  }

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email('E-mail inválido')
      .required('Obrigatório'),
    message: Yup.string().required('Obrigatório')
  })

  const handleOnSubmit = (values: ContactForm, actions: any) => {
    axios({
      method: 'POST',
      url: 'https://formspree.io/f/mwkwyelw',
      data: values
    })
      .then(_ => {
        actions.setSubmitting(false)
        actions.resetForm()
        handleServerResponse(true, 'Obrigado por sua mensagem!')
      })
      .catch(error => {
        actions.setSubmitting(false)
        handleServerResponse(false, error.response.data.error)
      })
  }

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
                  <Formik
                    initialValues={{
                      email: '',
                      message: ''
                    }}
                    onSubmit={handleOnSubmit}
                    validationSchema={formSchema}
                  >
                    {({ isSubmitting }) => (
                      <Form className="flex flex-col">
                        <label htmlFor="email" className="sr-only">E-mail</label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          placeholder="E-mail"
                          className="field px-4 py-4 rounded-md mb-8"
                          required
                        />
                        <label htmlFor="message" className="sr-only">Mensagem</label>
                        <Field
                          id="message"
                          name="message"
                          component="textarea"
                          placeholder="Mensagem"
                          className="field px-4 py-4 rounded-md mb-8"
                          rows={6}
                          required
                        />
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md mb-8 font-bold bg-red-600 text-white">
                          Submit
                        </button>
                        {serverState && (
                          <p className={!serverState.ok ? 'errorMsg' : ''}>
                            {serverState.msg}
                          </p>
                        )}
                      </Form>
                    )}
                  </Formik>
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
