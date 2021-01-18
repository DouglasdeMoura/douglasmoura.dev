import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Inputs = {
  name: string,
  email: string,
  messagem: string,
};

const ContactForm = () => {
  const { register, handleSubmit, reset, errors } = useForm<Inputs>()
  const [serverState, setServerState] = useState({ ok: false, msg: '' })

  const handleServerResponse = (ok: boolean, msg: string) => {
    setServerState({ ok, msg })
  }

  const handleOnSubmit = (data: Inputs) => {
    axios({
      method: 'POST',
      url: 'https://formspree.io/f/mwkwyelw',
      data
    })
      .then(_ => {
        handleServerResponse(true, 'Obrigado por sua mensagem!')
        reset()
      })
      .catch(error => {
        handleServerResponse(false, error.response.data.error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col">
        <label htmlFor="name" className="sr-only">Nome</label>
        <input
          name="name"
          ref={register({ required: true })}
          className="field px-4 py-4 rounded-md mb-8"
          placeholder="Nome"
          required
        />
        {errors.name && <span>Insira seu nome</span>}

        <label htmlFor="email" className="sr-only">E-mail</label>
        <input
          name="email"
          type="email"
          ref={register({ required: true })}
          className="field px-4 py-4 rounded-md mb-8"
          placeholder="E-mail"
          required
        />
        {errors.email && <span>E-mail inválido</span>}

        <label htmlFor="message" className="sr-only">Mensagem</label>
        <textarea
          className="field px-4 py-4 rounded-md mb-8"
          name="message"
          rows={6}
          placeholder="Mensagem"
          required
        >
        </textarea>

        <button
          type="submit"
          className="px-4 py-2 rounded-md mb-8 font-bold bg-red-600 text-white"
        >
          Enviar
      </button>
      </form >
      {
        serverState.msg && (
          <p
            className={
              !serverState.ok ? 'text-red-800 bg-red-100 p-4 rounded-md text-center' : 'text-green-800 bg-green-100 p-4 rounded-md text-center'
            }
          >
            {serverState.msg}
          </p>
        )
      }
    </>
  )
}

export default ContactForm
