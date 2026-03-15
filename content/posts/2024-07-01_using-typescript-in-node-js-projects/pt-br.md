---
title: Usando TypeScript em projetos Node.js
slug: usando-typescript-em-projetos-node-js
locale: pt-BR
created: 2024-07-08 09:51:28.826Z
updated: 2024-07-08 09:51:28.826Z
tags:
  - Node.js
  - javascript
  - typescript
cover: ./cover.jpg
type: post
---

[TypeScript](https://www.typescriptlang.org/) é extremamente útil durante o desenvolvimento de aplicações Node.js. Vamos ver como configurá-lo para uma experiência de desenvolvimento tranquila.

## Configurando o TypeScript

Primeiro, precisamos instalar o TypeScript. Podemos fazer isso executando o seguinte comando:

```bash
npm i -D typescript
```

Em seguida, precisamos criar um arquivo `tsconfig.json` na raiz do nosso projeto. Este arquivo conterá a configuração do TypeScript para o nosso projeto. Aqui está um exemplo de um arquivo `tsconfig.json` que peguei do [Total TypeScript](https://www.totaltypescript.com/tsconfig-cheat-sheet) e adicionei mais algumas coisas (leia o código e preste atenção aos comentários):

```json
{
  "compilerOptions": {
    /* Opções Base: */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    /* Configurando ~ como alias para o diretório src/ */
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    },

    /* Rigor */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    /* Se compilando com TypeScript: */
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,

    /* E se você estiver construindo para uma biblioteca: */
    "declaration": true,

    /* E se você estiver construindo para uma biblioteca em um monorepo: */
    "composite": true,
    "declarationMap": true,

    /* Se NÃO estiver compilando com TypeScript: */
    "module": "preserve",
    "noEmit": true,

    /* Se o seu código roda no DOM: */
    "lib": ["es2022", "dom", "dom.iterable"],

    /* Se o seu código não roda no DOM: */
    "lib": ["es2022"]
  },
  /* Estou considerando que todo o seu código está em src/ */
  "include": ["src/**/*.ts"]
}
```

## Configurando o script de build

Em seguida, precisamos configurar um script de build que irá compilar nosso código TypeScript para JavaScript. Primeiro, instale [`tsc-alias`](https://www.npmjs.com/package/tsc-alias) para lidar com os aliases que definimos no arquivo `tsconfig.json`:

```bash
npm i -D tsc-alias
```

Depois, você pode adicionar o script `build` adicionando o seguinte script ao nosso arquivo `package.json`:

```json
{
  "scripts": {
    "build": "tsc && tsc-alias"
  }
}
```

## Configurando o script de desenvolvimento

Agora, precisamos configurar um script de desenvolvimento que irá observar mudanças em nossos arquivos TypeScript e recompilá-los. Pessoalmente, gosto de usar [`tsx`](https://tsx.is/), pois proporciona uma experiência de desenvolvimento muito mais rápida em comparação com o [TypeScript watcher](https://www.typescriptlang.org/docs/handbook/configuring-watch.html) ou [ts-node](https://typestrong.org/ts-node/). Primeiro, instale `tsx`:

```bash
npm i -D tsx
```

Depois, você pode adicionar o script `dev` (para iniciar o projeto em modo de desenvolvimento) adicionando o seguinte script ao seu arquivo `package.json`:

```json
{
  "scripts": {
    "build": "tsc && tsc-alias",
    "dev": "node --import=tsx --watch ./src/index.ts"
  }
}
```

Sim, você não terá verificação de tipos enquanto desenvolve usando `tsx`, mas você pode rodar `npm run build` para isso ou adicionar um novo script `typecheck` ao seu `package.json` e executá-lo sempre que quiser verificar erros de tipos:

```json
{
  "scripts": {
    "build": "tsc && tsc-alias",
    "dev": "node --import=tsx --watch ./src/index.ts",
    "typecheck": "tsc --noEmit"
  }
}
```
