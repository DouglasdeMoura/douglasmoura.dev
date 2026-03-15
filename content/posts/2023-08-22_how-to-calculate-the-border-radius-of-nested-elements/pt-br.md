---
title: Como calcular o raio da borda (border-radius) de elementos aninhados
slug: como-calcular-o-raio-da-borda-de-elementos-aninhados
locale: pt-BR
created: 2023-08-22 20:05:26.070Z
updated: 2023-08-30 18:47:29.128Z
tags:
  - CSS
  - HTML
  - Dicas
cover: ./cover.jpg
---

A propriedade [`border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) permite arredondar as bordas de um elemento. Dar o mesmo valor de `border-radius` para o elemento pai e elemento filho não resulta na melhor aparência, então como calcular o raio da borda de elementos aninhados?

Observe a demonstração abaixo:

<CodePen id="ExGaRJY" />

No exemplo acima, os dois círculos possuem o mesmo raio e estão inscritos nos quadrados com bordas arredondas. Note que o raio da borda é o mesmo raio do círculo. Nós queremos que o fim do arco do círculo de cada borda comece seja coincidente com ambos os quadrados. Isso pode ser feito de duas formas:

1. Raio da borda do quadrado interno (R<sub>i</sub>) + espaçamento entre os quadrados (E) = raio da borda do quadrado externo (R<sub>e</sub>);
2. Raio da borda do quadrado externo (R<sub>e</sub>) - espaçamento entre os quadrados (E) = raio da borda do quadrado interno R<sub>i</sub>.

Observe que o centro dos círculos inscritos nos quadrados não coincidem, assim como o fim do arco da borda. Ainda assim, o resultado é satisfatório.

## Bônus

Neste exemplo interativo, feito por [Jhey Tompkins](https://jhey.dev/), você pode ver como essa regra se aplica na prática:

<CodePen user="jh3y" id="KKrYaxx" />

## Referências

- [@jh3yy](https://twitter.com/jh3yy/status/1688542283602231296)
- [Tip: Perfect nested border radius in CSS](https://www.30secondsofcode.org/css/s/nested-border-radius/)
- [CSS3 border-radius Property](https://www.w3schools.com/cssref/css3_pr_border-radius.asp)
- [CSS Backgrounds and Borders Module Level 3](https://www.w3.org/TR/css-backgrounds-3/#corners)
