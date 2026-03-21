---
title: Reconstruindo o blog (Vite, React e Cloudflare Workers)
slug: reconstruindo-o-blog-vite-react-e-cloudflare-workers
locale: pt-BR
created: 2026-03-21 12:00:00.000Z
updated: 2026-03-21 18:08:35.000Z
tags:
  - webdev
  - programming
  - cloudflare
cover: ./cover.jpg
---

Há alguns anos eu escrevi sobre [como montei a versão anterior deste site](https://douglasmoura.dev/pt-BR/ano-novo-blog-novo-ou-como-eu-criei-este-blog-para-2023): Next.js no frontend, [PocketBase](https://pocketbase.io) no backend e [Mantine](https://mantine.dev) para a UI. Funcionou bem para o que eu precisava na época. Essa versão é uma aposta diferente: o conteúdo mora no repositório e tudo roda em Cloudflare Workers.

## Por que mudar?

Hospedar o PocketBase, o [Litestream](https://litestream.io/) e tudo ao redor era tranquilo, mas eu queria algo mais simples. Fazer deploy de um Worker, servir os assets estáticos do mesmo lugar, tratar os posts como arquivos Markdown que eu posso versionar e revisar como código. Sem processo de banco de dados pra ficar cuidando, sem painel de admin que precisa estar online pro blog funcionar.

## A estrutura do app

O site é um app React 19 feito com Vite e deployado como um Cloudflare Worker. Rotas, layouts e renderização no servidor passam pelo [RedwoodSDK](https://rwsdk.com/) (`rwsdk`), que me permite definir rotas, headers compartilhados, feeds e APIs JSON junto da árvore de páginas. No lado do cliente, o RedwoodSDK cuida da navegação e da hidratação, então a experiência fica rápida sem transformar o site inteiro numa SPA pesada.

## Conteúdo e Markdown

Os posts ficam em `content/posts/` como Markdown com frontmatter, mesma ideia de antes, mas agora tudo é empacotado no build. O `import.meta.glob` do Vite carrega os arquivos, o gray-matter prcessa os metadados e cada idioma é apenas outro arquivo na mesma pasta (inglês e português). A internacionalização fica simples: URLs sob `/pt-BR/…` para português brasileiro, rotas padrão para inglês.

Para a renderização, uso [md4x](https://github.com/unjs/md4x) (WASM) para o Markdown em si, [Shiki](https://shiki.style/) para syntax highlighting, KaTeX para matemática e um pequeno Regex para adicionar notas de rodapé. O suficiente pra escrever posts técnicos sem arrastar metade da internet pro runtime.

## Busca (finalmente)

O [post anterior](https://douglasmoura.dev/pt-BR/ano-novo-blog-novo-ou-como-eu-criei-este-blog-para-2023) terminava dizendo que a busca ainda estava faltando. Depois que escrevi aquilo, acabei hackeando uma solução carregando todos os posts do PocketBase como JSON e filtrando no frontend com [Fuse.js](https://www.fusejs.io/). Eu sei, eu sei, não é a melhor forma de fazer isso, mas foi um experimento interessante. Agora a busca usa [Orama](https://docs.orama.com/docs/orama-js): na inicialização, o Worker monta índices separados para inglês e português (com os stemmers certos), e `/api/v1/search` retorna JSON para a UI. Sem serviço de busca externo, sem infraestrutura extra.

## Previews sociais e feeds

As imagens de Open Graph são geradas no Worker com [workers-og](https://github.com/kvnang/workers-og) (`ImageResponse` no estilo React). Os feeds Atom e RSS são gerados por idioma, e tem uma rota de sitemap para os motores de busca.

## O resto

- Tailwind CSS v4 com o plugin de tipografia para estilização dos artigos.
- [Phosphor icons](https://phosphoricons.com/), [cmdk](https://github.com/dip/cmdk) para a paleta de comandos, [react-wrap-balancer](https://react-wrap-balancer.vercel.app/) para os títulos e [react-tweet](https://react-tweet.vercel.app/) onde os posts incorporam tweets.
- Um pequeno `pnpm cli` (citty + consola + tsx) para criar e listar posts pelo terminal e extrair strings traduzíveis. Eu fiz meu próprio sistema de <abbr title="internacionalização">i18n</abbr>, inspirado no GNU [gettext](https://www.gnu.org/software/gettext/).
- [Ultracite](https://www.ultracite.ai/) (Oxlint + Oxfmt) mantém o TypeScript e a formatação consistentes; [lefthook](https://lefthook.dev/) roda verificações no commit.

Também adicionei alguns atalhos de teclado que eu queria que todo blog tivesse: <kbd>Ctrl</kbd>+<kbd>K</kbd> (ou <kbd>⌘</kbd>+<kbd>K</kbd> no Mac) abre a paleta de comandos para busca e navegação rápida, <kbd>Alt</kbd>+<kbd>T</kbd> alterna entre os temas claro, escuro e do sistema, e <kbd>Alt</kbd>+<kbd>L</kbd> troca entre inglês e português. Dentro da paleta de comandos, você pode pressionar <kbd>0</kbd>–<kbd>3</kbd> para ir direto para Home, Sobre, Palestras ou Bookmarks.

## Por que RedwoodSDK?

Eu acompanhei o [RedwoodJS](https://github.com/redwoodjs/graphql) por um bom tempo. A proposta original — React full-stack com GraphQL, Prisma, tudo junto — era interessante, mas nunca emplacou de verdade. Aí o time mudou de direção. Largaram o design centrado em GraphQL e reconstruíram tudo em cima de Cloudflare Workers e web standards. O que saiu disso é o [RedwoodSDK](https://rwsdk.com/), que é realmente um projeto diferente do que o RedwoodJS era.

O que me chamou a atenção foi o discurso de ["software pessoal"](https://rwsdk.com/personal-software). O Peter Pistorius, desenvolvedor principal do projeto, fala sobre criar software pra você mesmo, não pra escala enterprise. Um Worker, um alvo de deploy, o free tier da Cloudflare. Sem lock-in de $20/mês de hospedagem. Isso batia exatamente com o que eu queria pra esse blog.

O framework não tenta ser esperto. Sem codegen, sem convenções mágicas de arquivos, sem comportamento escondido. Você trabalha com `Request`, `Response` e web APIs que já conhece. E como tudo roda na Cloudflare, tenho D1, R2, Durable Objects — tudo acessível sem encanamento extra.

Mas no fundo, eu só queria experimentar algo diferente. Estou no ecossistema Next.js desde 2019. Construir em cima de um conjunto diferente de tradeoffs me pareceu um bom exercício.

## Por que sair do Next.js?

Eu amo o Next.js e venho usando em todos os meus projetos profissionais desde 2019. O único motivo de ter escolhido outro framework para este blog é que eu queria experimentar o RedwoodSDK. Já sinto falta de uma coisa: o componente `Image`. Agora estou carregando imagens sem nenhuma otimização ou tamanhos responsivos. Posso corrigir isso no futuro, mas por enquanto fica assim.

E tem outra coisa que é mais um feeling: a navegação client-side do Next.js parece um pouco mais suave. Não sei bem como colocar isso em palavras, mas o time do Next.js realmente acertou nessa experiência. O RedwoodSDK ainda não me passa a mesma sensação.

## Conclusão

Essa não é a única forma de manter um blog pessoal. Pra mim é o tradeoff certo agora: um alvo de deploy, Markdown no git, React onde ajuda, Workers na edge. Se você está pensando numa mudança parecida, espero que passar pelas peças te economize um tempo de pesquisa.

*Foto de capa: [Luca Onniboni](https://unsplash.com/@lucaonniboni) no [Unsplash](https://unsplash.com/photos/4v9Kk01mEbY).*
