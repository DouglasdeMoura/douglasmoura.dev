---
title: Criando modais nativos com o elemento dialog
slug: criando-modais-nativos-com-o-elemento-dialog
locale: pt-BR
created: 2023-08-13 01:49:01.615Z
updated: 2023-08-15 00:22:04.855Z
tags:
  - tutorial
  - javascript
  - html
cover: ./cover.jpg
---

Usar elementos customizados de diálogo no lugar das implementações nativas do navegador, como [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert),
[`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) ou [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt),
se tornou o padrão do desenvolvimento web há bastante tempo (popularizado por diversos plugins do [jQuery](https://jqueryui.com/dialog/) e pelo próprio [Bootstrap](https://getbootstrap.com/2.3.2/javascript.html#modals)), de modo que, a cada nova biblioteca de UI que surge[^1][^2][^3], é comum que seus autores re-implementem um modal com o framework da vez (que podem ou não implementar [acessibilidade WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)).

[^1]: [Modal do Material UI](https://mui.com/material-ui/react-modal/)

[^2]: [Modal do Ant Design](https://ant.design/components/modal)

[^3]: [Modal do Carbon Design System](https://carbondesignsystem.com/components/modal/usage/#live-demo)

Mas agora, com a chegada do elemento [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) no HTML5 (suportado por [93,85%](https://caniuse.com/dialog) dos navegadores em uso), é muito mais fácil criar diálogos de forma nativa. Neste artigo, vamos ver como criar um diálogo modal (e não-modal) simples com o elemento `<dialog>`.

## Entendendo o elemento _dialog_

No sentido empregado no desenvolvimento de interfaces de usuário, um **diálogo** é uma <q>conversação</q> entre o sistema e o usuário, onde o sistema espera uma resposta do usuário para continuar. Um diálogo pode ser **modal** ou **não-modal**. Um diálogo modal (isto é um, um diálogo que muda o **modo** de interação do usuário com o sistema) é aquele que trava a interface, impedindo o usuário de interagir com o restante da página até que ele seja fechado. Um diálogo não-modal (isto é um, um diálogo que _não_ muda o **modo** de interação do usuário com o sistema), por outro lado, permite que o usuário interaja com o restante da página enquanto o diálogo está aberto.

A maneira mais simples de colocar um diálogo não-modal na tela é da seguinte forma:

```html
<dialog open>
  <p>Olá, mundo!</p>
  <form method="dialog">
    <button>Fechar</button>
  </form>
</dialog>
```

Note o formulário, na linha 5, com o método _dialog_. É este formulário que envia ações para o `dialog`. Ele será exibido dessa forma:

<CodePen id="qBQzzww" />

O que torna o exemplo acima um diálogo não modal é o uso do atributo `open` (linha 1), o que também faz com que ele não possa ser fechado com a tecla `Esc`. Também é possível criar um diálogo não modal usando a API JavaScript:

<CodePen id="BaGXqjx" />

Agora, para que o diálogo se comporte como um modal, é necessário que ele seja aberto através de sua API JavaScript, você pode ver no exemplo a seguir:

<CodePen id="ZEmdgYj" />

Desta vez, abrimos e fechamos o modal com JavaScript e colocamos o resultado do formulário no elemento `output` quando o modal é fechado. Leia o código com calma e tente entender o que está acontecendo.

## Estilizando o modal

O elemento `dialog` pode (é claro), ser estilizado como qualquer outro elemento HTML. Atente-se, porém, que, para estilizar o _overlay_ (o fundo escuro que fica atrás do modal), é necessário usar o seletor `::backdrop`:

<CodePen id="PoxrMzW" />

## Polyfill

Se você quiser usar o `dialog` e não ter problemas de compatibilidade em navegadores mais antigos, pode usar este [polyfill](https://github.com/GoogleChrome/dialog-polyfill).

<hr />

<h3>Referências</h3>

- [Dialog](https://web.dev/learn/html/dialog/)
- [Dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [Modal & Nonmodal Dialogs: When (& When Not) to Use Them](https://www.nngroup.com/articles/modal-nonmodal-dialog/)
