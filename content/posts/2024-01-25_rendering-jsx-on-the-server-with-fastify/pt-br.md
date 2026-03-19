---
title: Renderizando JSX no servidor com Fastify
slug: renderizando-jsx-no-servidor-com-fastify
locale: pt-BR
created: 2024-01-25 00:16:10.675Z
updated: 2024-01-25 00:42:27.538Z
tags:
  - Dicas
  - Node.js
  - javascript
  - Fastify
cover: ./cover.jpg
type: post
---

[JSX](https://facebook.github.io/jsx/) é uma excelente abstração para montar interfaces. Introduzida pelo Facebook e popularizada pelo React, trata-se de uma extensão do JavaScript para abstrair a chamada de funções aninhadas. É esperado que o código JSX seja pré-processado (transpilado) para JavaScript válido antes de ser executada nos navegadores ou em ambientes como Node.js.

## Configuração do projeto

Antes de tudo, vamos iniciar o nosso projeto e instalar as dependências necessárias:

```
npm init -y
npm i fastify react react-dom
npm i -D @types/node @types/react @types/react-dom tsx typescript
```

Agora, configuramos os *scripts* do nosso projeto. O `package.json` deverá ficará assim:

```json
{
  "type": "module",
  "name": "fastify-react",
  "version": "1.0.0",
  "author": "Douglas Moura <douglas.ademoura@gmail.com>",
  "description": "POC on rendering React components from Fastify",
  "main": "dist/main.js",
  "scripts": {
    "start": "tsc && node dist/main.js",
    "dev": "tsx --watch src/main.tsx",
    "build": "tsc"
  },
  "license": "ISC",
  "dependencies": {
    "fastify": "^4.25.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.6",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

E esse é o `tsconfig.json` que iremos utilizar:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["dom", "es6", "es2017", "esnext.asynciterable"],
    "skipLibCheck": true,
    "sourceMap": false,
    "outDir": "./dist",
    "moduleResolution": "node",
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "jsx": "react-jsx"
  },
  "exclude": ["node_modules"],
  "include": ["./src/**/*.ts", "./src/**/*.tsx"]
}
```

## Criando nossos componentes

O ecossistema do React já fornece as ferramentas necessárias para renderizarmos os nossos componentes para HTML e enviarmos diretamente do servidor para o nosso cliente. Então, primeiro, vamos criar o componente raiz:

```ts
// src/components/root.tsx

type  RootProps  = {
  children:  React.ReactNode
  title:  string
}

export  function  Root({ children, title }:  RootProps) {
  return (
    <html  lang="en">
      <head>
        <meta  charSet="utf-8"  />
        <meta  name="viewport"  content="width=device-width, initial-scale=1"  />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

E nossa página inicial:

```ts
// src/components/index.tsx

export  function  App() {
  return (
    <h1>Hello, World!</h1>
  )
}
```

## Configurando o Fastify para renderizar nosso componente React

Como não pretendemos carregar o React para hidratar o nosso HTML do lado do cliente, podemos usar a função `renderToStaticMarkup` exportada de `react-dom/server`. Nosso arquivo de inicialização do servidor ficará assim:

```ts
import Fastify from  'fastify'
import { renderToStaticMarkup } from  'react-dom/server'

// Importando com o `.js` no final, o arquivo "buildado"
// fará as importações corretamente e você não deverá ver nenhum erro na
// IDE, ainda que os arquivos tenham a extensão `.tsx`.
import { App } from  './components/index.js'
import { Root } from  './components/root.js'

type  RenderArgs  = {
  children:  React.ReactNode
  title:  string
}

const  render  = ({ title, children }:  RenderArgs) => {
  // Aqui, inserimos `<!DOCTYPE html>`
  return `<!DOCTYPE html>${renderToStaticMarkup(
    <Root  title={title}>{children}</Root>
  )}`
}

const fastify =  Fastify({
  logger:  true,
})

fastify.get('/', async  function  handler(_request, reply) {
  reply.type('text/html')
  return  render({ children:  <App  />, title:  'Hello, World!' })
})

try {
  await fastify.listen({ port:  3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
```

Se você iniciar o projeto agora (`npm run dev`), você deverá ver a página em http://localhost:3000. Claro, podemos melhorar a nossa implementação usando a nova API de stream, introduzida no React 18 ([que é o método recomendado](https://github.com/reactwg/react-18/discussions/106#discussion-3611411)). Para isso, faremos as seguintes alterações no nosso código:

```ts
import Fastify from  'fastify'
import { renderToStaticNodeStream } from  'react-dom/server'
import { Transform } from  'node:stream'

import { App } from  './components/index.js'
import { Root } from  './components/root.js'

type  RenderArgs  = {
  children:  React.ReactNode
  title:  string
}

const  render  = ({ title, children }:  RenderArgs) => {
  let  isFirstChunk  =  true
  const  prepend  =  new  Transform({
    transform(chunk, _encoding, callback) {
      if (isFirstChunk) {
        isFirstChunk  =  false
        this.push('<!DOCTYPE html>')
      }
      callback(null, chunk)
    },
  })

  return  renderToStaticNodeStream(
    <Root  title={title}>{children}</Root>
  ).pipe(prepend)
}

const  fastify  =  Fastify({
  logger:  true,
})

fastify.get('/', async  function  handler(_request, reply) {
  const  stream  =  render({ children:  <App  />, title:  'Hello, World!' })

  reply.type('text/html')
  reply.send(stream)
})

try {
  await  fastify.listen({ port:  3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
```

E com isso, conseguimos renderizar nossos componentes React do lado do servidor e fazer *streaming* deles para o nosso cliente. E este é o [link](https://github.com/DouglasdeMoura/react-fastify) do repositório.
