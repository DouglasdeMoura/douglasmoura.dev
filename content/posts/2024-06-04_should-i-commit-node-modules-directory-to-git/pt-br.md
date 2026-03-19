---
title: Devo commitar o node_modules no git?
slug: devo-commitar-o-node-modules-no-git
locale: pt-BR
created: 2024-06-04 17:49:35.568Z
updated: 2024-06-04 17:49:35.568Z
tags:
  - Node.js
  - javascript
  - npm
cover: ./cover.webp
type: post
---

TL; DR: Não. Por favor, adicione `node_modules` ao seu arquivo `.gitignore`:

```
node_modules
```

## Mas, por quê?

O diretório `node_modules` é onde o seu gerenciador de pacotes (que pode ser o [npm](https://www.npmjs.com/), [yarn](https://classic.yarnpkg.com/) ou [pnpm](https://pnpm.io/)) irá instalar todas as dependências do projeto listadas no seu `package.json`. Independentemente do gerenciador de pacotes que você escolher, um lockfile (`package-lock.json`, `yarn.lock` ou `pnpm-lock.yaml`, respectivamente) será gerado na primeira vez que você instalar as dependências do seu projeto, descrevendo toda a árvore de dependências. Dessa forma, toda vez que você precisar reinstalar as dependências do seu projeto, você obterá exatamente os mesmos arquivos.

O lockfile deve ser *commitado* no `git`, permitindo a reinstalação da árvore de dependências em qualquer outro ambiente, o que torna desnecessário commitar o diretório `node_modules` no `git` (além disso, isso reduz muito o tamanho do seu repositório, já que o `node_modules` pode consumir gigabytes de espaço).
