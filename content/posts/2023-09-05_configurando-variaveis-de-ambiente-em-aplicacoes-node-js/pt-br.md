---
title: Configurando variáveis de ambiente em aplicações Node.js
slug: configurando-variaveis-de-ambiente-em-aplicacoes-node-js
locale: pt-BR
created: 2023-09-05 21:01:49.238Z
updated: 2026-03-18 21:24:53.000Z
tags:
  - Node.js
  - javascript
cover: ./cover.jpg
---

A partir do Node.js 20.6.0, é possível carregar variáveis de ambiente a partir de um arquivo `.env` de maneira nativa, sem a necessidade de utilizar o pacote [`dotenv`](https://www.npmjs.com/package/dotenv).

Para isso, basta iniciar o seu projeto usando o seguinte comando:

```bash
node --env-file=.env index.js
```

<aside data-alert data-color="blue" role="note">
<strong>Variáveis de ambiente</strong>
<a href="https://pt.wikipedia.org/wiki/Vari%C3%A1vel_de_ambiente">Variáveis de ambiente</a> são valores, definidos pelo usuário que podem afetar o o modo que um programa é executado no computador. Tais valores são usados para passar informações para programas, scripts e comandos, sem que seja necessário alterar o código fonte.
</aside>

## E para versões mais antigas do Node.js?

Bom, neste caso você pode continuar utilizando o pacote [`dotenv`](https://www.npmjs.com/package/dotenv):

```bash
npm install dotenv
node -r dotenv/config index.js
```

## E por que eu deveria usar variáveis de ambiente?

Variáveis de ambiente permitem que você acesse informações sensíveis em seu código (credenciais de acesso ao banco de dados, chaves de API, etc.), sem que seja necessário armazenar essas informações diretamente no código fonte. Isso facilita a definição de variáveis distintas para diferentes ambientes de desenvolvimento (local, desenvolvimento, homologação, produção, etc.) sem que seja necessário alterar o código. Conforme a própria recomendação do [Twelve-Factor App](https://12factor.net/pt_br/config):

> A prova de fogo para saber se uma aplicação tem todas as configurações corretamente consignadas fora do código é saber se a base de código poderia ter seu código aberto ao público a qualquer momento, sem comprometer as credenciais.

Além disso facilitar o trabalho da equipe, também evita que informações sensíveis possam vazar para o repositório de projeto.

Então, nunca esqueça de adicionar seus arquivos `.env` ao `.gitignore`:

```
// .gitignore
.env
*.env
.env.*
*.env.*
```
