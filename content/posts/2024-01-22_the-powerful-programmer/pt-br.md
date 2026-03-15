---
title: O programador poderoso
slug: o-programador-poderoso
locale: pt-BR
created: 2024-01-22 20:18:03.828Z
updated: 2024-01-23 13:26:49.676Z
tags:
  - Engenharia de Software
  - Padrões de Projeto
  - Carreira
cover: ./cover.jpg
type: post
---

Estimar, implementar e implantar software, rapidamente, é uma característica de programadores poderosos, como diz [Kent Beck](https://www.kentbeck.com/) em seu livro [Extreme Programming Explained](https://www.oreilly.com/library/view/extreme-programming-explained/0201616416/). Vou explorar estes três pontos neste artigo, inserindo minhas próprias opiniões em cada ponto.

## Estimativa

Estimar um projeto software é [difícil](https://jacobian.org/2021/may/20/estimation/), e existem diversas técnicas diferentes de como estimar um projeto de software. Você pode criar um método, pela sua própria experiência, aprender o método utilizado por outras empresas mas, deve se atentar que, o ponto central é que você ter uma boa ideia de quanto tempo o projeto levará. Projetos têm começo, meio e fim. Aprenda a estimar (bem) o seu trabalho.

## Implementação

Para mim, particularmente, implementar é a parte mais divertida do projeto. E como em todo trabalho, temos que ser pragmáticos na escolha da linguagem e das ferramentas. Ser pragmático na escolha não significa, necessariamente, usar o mesmo que todo mundo utiliza, pois, muitas vezes, algumas ferramentas continuam fortes no mercado por pura inércia. O [Express](https://expressjs.com/) é um bom exemplo disso. Além de haverem muitas opções melhores e com um melhor suporte (como o [Fastify](https://fastify.dev/)), muitas equipes ainda começam novos projetos com Express, mesmo que ele não esteja sendo mantido regularmente, não trate rejeições de Promises, etc.

Fora a questão da escolha de ferramentas, é preciso que você **domine** a pilha de tecnologias do seu projeto, sendo capaz de implementar as melhores soluções no menor tempo possível. Na ponta da língua, você tem que saber um bom padrão para aplicar no projeto, um bom framework para o backend, um bom framework para o frontend ou mesmo um bom framework full stack. E a experiência do desenvolvimento não pode ficar de fora. Para que a implementação seja rápida, o entendimento do projeto deve ser fácil, sua documentação adequada e seus testes precisam validar os fluxos de **intenção** do usuário que utilizará o sistema.

## Implantação

Hoje, você consegue construir um projeto inteiro e colocar em produção, sozinho? E não estou falando de subir um o seu projeto em uma plataforma completamente gerenciada, como a Vercel, mas sim, de pegar uma máquina Linux, instalar as ferramentas necessárias e expor a sua aplicação para a web. E não, isso não é nenhum tipo de purismo. Se você não é uma startup que pode queimar alguns milhões de reais por anos, sem se preocupar com o custo da sua infraestrutura, deveria, pelo menos, saber como iniciar a sua aplicação e mantê-la ativa entre as reinicializações do servidor (de preferência, usando _containers_), colocá-la atrás de um proxy reverso (como o [NGINX](https://www.nginx.com/) ou [Caddy](https://caddyserver.com/)), configurar um firewall e fazer um backup do banco de dados em três lugares diferentes. Você ainda pode subir várias instâncias da sua aplicação e usar a mesma ferramenta de proxy como load balancer para distribuir os acessos da sua aplicação às diferentes instâncias que estão rodando.
