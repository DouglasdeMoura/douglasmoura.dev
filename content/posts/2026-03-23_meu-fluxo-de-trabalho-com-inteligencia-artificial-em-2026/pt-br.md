---
title: Meu fluxo de trabalho com inteligência artificial em 2026
slug: meu-fluxo-de-trabalho-com-inteligencia-artificial-em-2026
locale: pt-BR
created: 2026-03-23 21:52:01.313Z
updated: 2026-03-24 19:46:26.000Z
tags:
  - AI
  - workflow
  - LLM
---

Ferramentas como Claude Code e Codex se tornaram praticamente onipresentes na vida de todo programador e praticamente todos os grandes nomes da indústria já consideram o método tradicional de programar (que é digitar todo o código manualmente) algo ultrapassado. No meio de tudo isso, eu mesmo estou me divertindo e construindo software pessoais e fazendo experimentos e, como posso dizer, brincadeiras mesmo, com software, em uma velocidade nunca antes vista. Mas, vamos ao que interessa: como estou usando tudo isso ao meu favor?

## Do Cursor para o Claude Code

Até a metade do ano passado, eu usava o Cursor de maneira esporádica mas, nunca gostei muito do jeito que o Cursor sugere que você trabalhe. Mantinha o *autocomplete* desativado e mantinha algumas conversas no chat. E quando digo conversar, são conversas mesmo, como se eu estivesse falando com outro desenvolvedor da minha equipe, a fim de chegar a uma solução para o problema. Mas, com o advento do Claude Code, eu abandonei o Cursor completamente. De repente, eu estava rodando de 2 e a 4 agentes em diferente abas no terminal, enquanto revisava e escrevia código no VS Code (claro, depois de ter removido qualquer resquício do Copilot). Mas, meu fluxo continuou parecido com o que já estava fazendo no Cursor: longas conversas para chegar a uma boa solução para o problema em questão.

## Ralph loops

No começo de dezembro, logo após o lançamento do [Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5), houve um grande aumento na qualidade dos códigos produzidos pelo Claude Code. Foi mais ou menos nessa época que comecei a usar [Ralph Loops](https://block.github.io/goose/docs/tutorials/ralph-loop/) para finalizar diversas tarefas quase sem a minha intervenção. Depois de testar várias metodologias, a que mais me deu bons resultados foi a ensinada pelo [Matt Pocock](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum), que eu adaptei para as minhas necessidades. Claro, o trabalho que delegava para os Ralph loops sempre foram os mais bem documentatos, e sempre adiciona instruções minuciosas, passo-a-passo, e de pequeníssimo escopo, para garantir que o resultado fosse exatemente o esperado. Fiz diversas refatorações e algumas migrações na base de código em que trabalho com essa técnica, mas, nunca voltei a usá-la tanto quanto nesse período.

## Skills

E agora, em março de 2026, o que mais tenho utilizado são *[skills](https://agentskills.io/home)* que criei para a próprias necessidades do meu projeto, baseadas no [GStack](https://github.com/garrytan/gstack) e na [Superpowers](https://github.com/obra/superpowers). No topo disso, ainda criei um *bash script* para fazer criar os <abbr title="Pull Requests">PRs</abbr>, revisar e fazer o *deploy* da aplicação. Claro, você pode pedir para o Claude fazer isso, mas meu intuito é apenas de utilizar menos tokens e documentar o meu processo de trabalho para futuros integrantes da equipe (já que, até o momento, sou o único engenheiro do time).

## O trabalho em si

E quanto ao meu *prompt*? Continua muito parecido com o que fazia desde o começo: muita conversa com a LLM a fim de definir um plano de ação. Pequenos *commits*, com testes (que eu reviso cuidadosamente), fazendo a implementação progressiva do que precisa ser feito.

E como está sendo o seu fluxo de desenvolvimento com IA?
