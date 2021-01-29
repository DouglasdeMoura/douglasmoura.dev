---
title: 'Introdução ao React'
excerpt: 'Aprenda os principais conceitos para entender o React de uma vez por todas'
slug: 'introducao-ao-react'
coverImage: '/assets/blog/ola-mundo/cover.png'
date: '2021-01-29T05:35:07.322Z'
author:
  name: Douglas Moura
  picture: 'https://www.gravatar.com/avatar/997c72f0b7ca0fc26bdf60ca27cb4194'
ogImage:
  url: '/assets/blog/ola-mundo/cover.png'
---

## ⚛️ React

[React](https://reactjs.org/) é um biblioteca JavaScript desenvolvida pelo Facebook desde 2013. Seu objetivo é facilitar a criação de interfaces de usuário (UI) complexas em aplicações *web* e *mobile* como, por exemplo, o Deezer:

![Captura de tela do Deezer](./public/images/deezer-screenshot.png)

O React facilita a separação da sua UI em vários componentes lógicos, auto-contidos e reutilizáveis. Na prática, cada componente criado com o React é apenas uma função que retorna algum resultado e que pode (ou não) ter um estado interno[^exemplo-0][^exemplo-1][^state].

```javascript
// Importa o React para criar nossos componentes
import React from 'https://cdn.skypack.dev/react'
// Importa o React DOM para manipular o DOM do navegador
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

// Cria uma apelido para a função de criar elemento
const e = React.createElement

// Cria o componente
const Saudacao = ({ nome = 'Mundo' }) => {
  return e(
    'div',
    null,
    `Olá, ${nome}`
  )
}

// Renderiza o componente acima no navegador
ReactDOM.render(
  Saudacao({ nome: 'Douglas' }),
  document.getElementById('main')
)
```

Para facilitar a construção de layouts complexos com o React, o Facebook introduziu uma nova sintaxe ao [ECMAScript](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/) chamada [**JSX**](http://facebook.github.io/jsx/). O JSX não foi proposto para ser incorporado à especificação oficial do ECMAScript, mas sim, para ser utilizado por pré-processadores (transpiladores[^transpilers]) como [Babel](https://babeljs.io/), [esbuild](https://esbuild.github.io/), [swc](https://swc.rs/) e [Sucrase](https://sucrase.io/).

Mas o que o JSX significa na prática? Significa que podemos chamar nossos componentes React como *tags* XML. Desse modo, podemos reescrever o componente `Saudacao` (definido acima) da seguinte forma[^exemplo-2]:

```javascript
// Importa o React para criar nossos componentes
import React from 'https://cdn.skypack.dev/react'
// Importa o React DOM para manipular o DOM do navegador
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

// Cria o componente
const Saudacao = ({ nome = 'Mundo' }) => {
  return (
    <div>
      Olá, {nome}
    </div>
  )
}

// Renderiza o componente acima no navegador
ReactDOM.render(
  <Saudacao nome="Douglas" />,
  document.getElementById('main')
)
```

O código acima **não** não executará no navegador. Utilizando o Babel para transpilar este código, temos o seguinte resultado:

```javascript
// Importa o React para criar nossos componentes
import React from 'https://cdn.skypack.dev/react';
// Importa o React DOM para manipular o DOM do navegador
import ReactDOM from 'https://cdn.skypack.dev/react-dom';

// Cria o componente
var Saudacao = function Saudacao(_ref) {
  var _ref$nome = _ref.nome,
      nome = _ref$nome === undefined ? 'Mundo' : _ref$nome;

  return React.createElement(
    'div',
    null,
    'Ol\xE1, ',
    nome
  );
};

// Renderiza o componente acima no navegador
ReactDOM.render(React.createElement(Saudacao, { nome: 'Douglas' }), document.getElementById('main'));

```

E agora sim, podemos executar nosso componente no navegador. É importante lembrar que, durante o desenvolvimento, não é necessário trabalhar ou editar qualquer coisa no código transpilado.

## Manipulando o DOM a renderizando atualizações

Para que possamos entender melhor como o React renderiza a interface do usuário, devemos entender o que é o [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) (Document Object Model)[^dom]. O DOM é uma representação de um documento XML ou HTML no formato de árvore (grafo). Em um documento HTML, por exemplo, a tag `<html>` é a raiz da página e o cabeçalho `<h1>` é um dos <q>galhos</q> (nós) dessa árvore. Cada nó desta árvore pode ou não ter atributos (no exemplo abaixo, a tag `a` possui o atributo `href` com o valor `#`).

Agora, observe o documento HTML abaixo:

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>Meu título</title>
  </head>
  <body>
    <h1>Meu cabeçalho</h1>
    <a href="#">Meu link</a>
  </body>
</html>
```

Este mesmo documento HTML pode ser representado da seguinte forma:

![Captura de tela do Deezer](./public/images/dom.png)

Dessa forma, podemos manipular o DOM da página[^dom-example] com os métodos que este objeto nos disponibiliza. [Acesse a especificação do DOM](https://dom.spec.whatwg.org/) para mais detalhes sobre os métodos e APIs que você pode utilizar ou mesmo desenvolver o sua própria implementação — assim como o time do React fez.

O React desencoraja que façamos a manipulação do DOM diretamente. Para isso, ele implementa o seu próprio DOM, chamado de [Virtual DOM (VDOM)](https://reactjs.org/docs/faq-internals.html). As alterações na interface do usuário são feitas neste DOM virtual, que o React mantém na memória, deixando para outra biblioteca (no caso, a biblioteca [React DOM](https://reactjs.org/docs/react-dom.html)) a tarefa de manter o DOM do navegador sincronizado com o DOM virtual do React.

[Abra este exemplo](https://codepen.io/douglasdemoura/pen/dyObLQQ) e inspecione o elemento que mostra as horas. Observe que o React só atualiza os os elementos que foram modificados desde a última renderização, mantendo o resto da página igual à seu último estado. Note que, no dia-a-dia, não utilizamos a função `ReactDOM.render` da maneira mostrada no exemplo.

```javascript
import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

function relogio() {
  const element = (
    <div>
      <h1>Que horas são?</h1>
      <h2>São {new Date().toLocaleTimeString()}.</h2>
    </div>
  );

  ReactDOM.render(element, document.getElementById('main'))
}

setInterval(relogio, 1000)
```

A única diferença que deve ser notada entre o VDOM do React e o DOM do navegador é que o time do React renomeou todos os atributos do DOM para seguir o padrão `camelCase` (`onclick` se tornou `onClick`, `onsubmit` se tornou `onSubmit`, etc.).

## Hooks

Agora que você entende o que é um componente React e sabe como criar seus próprios componentes com ou sem JSX, é preciso aprender como manipular o estado da sua aplicação, executar determinadas funções quando seu componente é renderizado, alterado ou removido da tela e como melhorar a performance dos seus componentes. Para tudo isso (e algumas outras coisas) o React fornece [*hooks*](https://reactjs.org/docs/hooks-intro.html).

Hooks são funções que expõem o estado e o ciclo de vida do React para seus componentes funcionais. Na prática, isso significa que não é mais necessário criar [componentes de classe](https://reactjs.org/docs/components-and-props.html), diminuindo a quantidade de código necessária para programar um componente. Os dois hooks mais utilizados são o [State Hook](https://reactjs.org/docs/hooks-state.html) (para gerenciar o estado) e o [Effect Hook](https://reactjs.org/docs/hooks-state.html) (para executar efeitos colaterais atrelados à interação do usuário ou ao ciclo de vida de um componente).

### State Hook

Quando usamos o State Hook em nosso componente, declaramos ao React que desejamos que ele gerencie os estados de determinada variável. Sempre que fazemos uma atualização em uma variável controlada pelo React, essa atualização é refletida na UI. [No exemplo abaixo](https://codepen.io/douglasdemoura/pen/ExNxyba), podemos ver isso em ação.

```javascript
import React, { useState } from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

const App = () => {
  // As variáveis controladas pelo React são imutáveis, portanto,
  // só podem ser alteradas pela função fornecida pelo useState
  // (para o caso abaixo, essa função se chama setValor).
  const [valorControladoPeloReact, setValor] = useState(0)

  // Essa variável só existe dentro do escopo deste componente -
  // o React não sabe seu valor e nem pode acompanhar sua mudança.
  let valorNaoControladoPeloReact = 0

  const handleOnClick = () => {
    // Observe que valorNaoControladoPeloReact nunca é atualizado na UI,
    // pois o React não está acompanhando suas atualizações.
    valorNaoControladoPeloReact = valorControladoPeloReact + 1

    // Porém, as atualizações efetuadas em valorNaoControladoPeloReact
    // sempre são refletidas na UI.
    setValor(valorControladoPeloReact + 1)

    // Note que a atualização do estado da aplicação é assíncrono
    // (abra o console do navegador).
    console.log('Variável local:', valorNaoControladoPeloReact)
    console.log('Variável controlada pelo React:', valorControladoPeloReact)
  }

  return (
    <div>
      <div>
        Valor não controlado pelo React: <strong>{valorNaoControladoPeloReact}</strong>
      </div>
      <div>
        Valor controlado pelo React: <strong>{valorControladoPeloReact}</strong>
      </div>
      <div>
        Os valores são iguais na memória no momento da atualização? {` `}
        {
          valorControladoPeloReact === valorNaoControladoPeloReact ?
            'Sim' : 'Não'
        }
      </div>
      <hr />
      <button onClick={handleOnClick}>+1</button>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('main')
)
```

### Effect Hook

Utilizamos o Effect Hook para executar funções a partir de determinadas interações efetuadas pelo usuário em nossa aplicação (acessar APIs no carregamento da página, modificar a UI, fazer um redirecionamento, etc.).
[No exemplo abaixo](https://codepen.io/douglasdemoura/pen/abBbmdJ), você pode verificar três casos de uso para o `useEffect`:

```javascript
import React, { useState, useEffect } from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

const App = () => {
  const [valorControladoPeloReact, setValor] = useState(0)
  const [comparacao, setComparacao] = useState(true)
  let valorNaoControladoPeloReact = 0

  const handleOnClick = () => {
    setValor(valorControladoPeloReact + 1)
  }

  useEffect(() => {
    // O emoji abaixo será exibido quando o componente for carregado
    // ou quando qualquer estado for alterado.
    console.log('👋')

    // O emoji abaixo será exibido quando o componente for
    // destruído.
    return () => console.log('💥')
  })

  useEffect(() => {
    console.log('🚀')
  }, [])
  // ^------------------
  // Este efeito será executado apenas uma vez, quando o
  // o componente for carregado. É neste efeito, por exemplo,
  // que faríamos uma chamada para uma API.

  useEffect(() => {
    // Ao contrário do exemplo anterior, agora nós só atualizamos
    // a variável local depois que a variável controlada pelo React
    // for atualizada...
    valorNaoControladoPeloReact = valorControladoPeloReact

    // ...e, para que essa comparação seja refletida na UI,
    // colocamos o resultado da comparação em outra
    // variável controlada pelo React.
    setComparacao(valorControladoPeloReact === valorNaoControladoPeloReact)
  }, [valorControladoPeloReact])
  // ^------------------
  // Este efeito será executado sempre que houver alguma atualização
  // em valorControladoPeloReact.

  useEffect(() => {
    console.log('🖊️')
  }, [valorNaoControladoPeloReact])
  // ^------------------
  // Este efeito será executado quando o componente for renderizado,
  // mas não é capaz de acompanhar as mudanças de um variável não
  // controlada pelo React.

  return (
    <div>
      <div>
        Valor não controlado pelo React: <strong>{valorNaoControladoPeloReact}</strong>
      </div>
      <div>
        Valor controlado pelo React: <strong>{valorControladoPeloReact}</strong>
      </div>
      <div>
        Os valores são iguais na memória? {` `}
        {
          comparacao ?
            'Sim' : 'Não'
        }
      </div>
      <hr />
      <button onClick={handleOnClick}>+1</button>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('main')
)
```

[Em construção]

[^exemplo-0]: [Vide exemplo 0 (criando um componente com a API nativa do navegador)](https://codepen.io/douglasdemoura/pen/vYyBZJe).
[^exemplo-1]: [Vide exemplo 1 (criando um componente com React)](https://codepen.io/douglasdemoura/pen/RwobgVL).
[^state]: [O que é estado, estado mutável e estado imutável (Stack Overflow)](https://softwareengineering.stackexchange.com/questions/235558/what-is-state-mutable-state-and-immutable-state?newreg=8a7c58264b9d44b29c56ccc0ee0cf59a)
[^transpilers]: Transpiladores são ferramentas que lêem o código-fonte escrito em alguma linguagem de programação e produzem um código equivalente em outro linguagem de programação. Há aproximadamente dez anos, o uma nova linguagem chamada [CoffeeScript](https://coffeescript.org/), ganhou muito destaque. Com uma nova sintaxe e com funções que facilitavam a programação para web (já que no final, o código é transpilado para JavaScript), foi rapidamente adotada por uma boa parcela da comunidade. Perdeu tração por conta das inovações adicionadas à especificação oficial do ECMAScript 2015. Você pode aprender mais sobre o Babel [neste vídeo](https://youtu.be/RZQMAuHE_hw?t=38) da Código Fonte TV, onde o Gabriel Fróes e a Vanessa Weber explicam o assunto com mais detalhes.
[^exemplo-2]: [Vide exemplo 2 (o Babel já está sendo carregado nesta página)](https://codepen.io/douglasdemoura/pen/XWNrgYX).
[^dom]: [Especificação do DOM](https://dom.spec.whatwg.org/).
[^dom-example]: Manipule [este exemplo](https://codepen.io/douglasdemoura/pen/xxRKepp) para entender o DOM.
