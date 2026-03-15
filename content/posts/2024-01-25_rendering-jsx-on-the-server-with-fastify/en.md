---
title: Rendering JSX on the Server with Fastify
slug: rendering-jsx-on-the-server-with-fastify
locale: en-US
created: 2024-01-25 00:35:37.056Z
updated: 2024-01-25 00:42:06.600Z
tags:
  - Fastify
  - Tips
  - javascript
  - Node.js
cover: ./cover.jpg
type: post
---

[JSX](https://facebook.github.io/jsx/) is an excellent abstraction for building web interfaces. Introduced by Facebook and popularized by React, it's an extension of JavaScript designed to abstract nested function calls. It's expected that JSX code will be pre-processed (transpiled) into valid JavaScript before being executed in browsers or environments like Node.js.

## Project Setup

First of all, let's start our project and install the necessary dependencies:

```
npm init -y
npm i fastify react react-dom
npm i -D @types/node @types/react @types/react-dom tsx typescript
```

Now, we set up the scripts for our project. The `package.json` should look like this:

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

And this is the `tsconfig.json` that we will use:

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

## Creating our components

The React ecosystem already provides the necessary tools for rendering our components to HTML and sending them directly from the server to our client. So, first, let's create the root component:

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

And our home page:

```ts
// src/components/index.tsx

export  function  App() {
  return (
    <h1>Hello, World!</h1>
  )
}
```

## Configuring Fastify to Render Our React Component

As we don't intend to load React to hydrate our HTML on the client side, we can use the `renderToStaticMarkup` function exported from `react-dom/server`. Our server initialization file will look like this:

```ts
import Fastify from  'fastify'
import { renderToStaticMarkup } from  'react-dom/server'

import { App } from  './components/index.js'
import { Root } from  './components/root.js'

type  RenderArgs  = {
  children:  React.ReactNode
  title:  string
}

const  render  = ({ title, children }:  RenderArgs) => {
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

If you start the project now (`npm run dev`), you should see the page at [http://localhost:3000](http://localhost:3000/). Of course, we can enhance our implementation by using the new streaming API, introduced in React 18 ([which is the recommended method](https://github.com/reactwg/react-18/discussions/106#discussion-3611411)). To do that, we will make the following changes to our code:

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

And with that, we are able to render our React components on the server side and stream them to our client. Here is the [link](https://github.com/DouglasdeMoura/react-fastify) to the repository.
