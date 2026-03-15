---
title: Múltiplas formas de somar os valores de um array de objetos, em TypeScript
slug: multiplas-de-somar-os-valores-de-um-array-de-objetos-em-typescript
locale: pt-BR
created: 2024-01-17 23:28:26.679Z
updated: 2024-01-23 13:49:43.604Z
tags:
  - tutorial
  - typescript
  - algorithms
cover: ./cover.jpg
---

Há algum tempo, o [Zan Franceschi](https://twitter.com/zanfranceschi) postou o seguinte desafio:

<Tweet id="1564671754483765251" />

Neste artigo, vou resolvê-lo de duas formas: uma com laços e outra sem laços, com TypeScript.

## Analisando os dados

Vou transcrever o JSON do desafio para facilitar a nossa análise:

```json
{
  "compras": [
    {
      "data": "2022-01-01",
      "produtos": [
        {
          "cod": "a",
          "qtd": 2,
          "valor_unitario": 12.24
        },
        {
          "cod": "b",
          "qtd": 1,
          "valor_unitario": 3.99
        },
        {
          "cod": "c",
          "qtd": 3,
          "valor_unitario": 98.14
        }
      ]
    },
    {
      "data": "2022-01-02",
      "produtos": [
        {
          "cod": "a",
          "qtd": 6,
          "valor_unitario": 12.34
        },
        {
          "cod": "b",
          "qtd": 1,
          "valor_unitario": 3.99
        },
        {
          "cod": "c",
          "qtd": 1,
          "valor_unitario": 34.02
        }
      ]
    }
  ]
}
```

Podemos definir o JSON acima em dois tipos distintos: `Produto` e `Compra`. Seus nomes são autoexplicativos, mas vou defini-los aqui para facilitar a leitura do código:

```ts
type Produto = {
  cod: string;
  qtd: number;
  valor_unitario: number;
};

type Compra = {
  data: string;
  produtos: Produto[];
};
```

## Escrevendo testes

Antes de começar a escrever o código, vamos escrever alguns testes para garantir que o código está funcionando corretamente. Para isso, vamos usar o [Vitest](https://vitest.dev/).

```ts
import { describe, expect, test } from "vitest";
import {
  somaComFor,
  somaComForIn,
  somaComForOf,
  somaComWhile,
  somaComForEach,
  somaComReduce,
  somaComFlatMapEReduce,
  somaComSum,
  somaComSumEFlatMap,
} from "./desafio-da-soma";

const { compras } = await import("./data.json", { with: { type: "json" } });

const result = 434.93999999999994;

describe("Desafio da soma", () => {
  test("somaComFor", () => {
    expect(somaComFor(compras)).toBe(result);
  });

  test("somaComForOf", () => {
    expect(somaComForOf(compras)).toBe(result);
  });

  test("somaComForIn", () => {
    expect(somaComForIn(compras)).toBe(result);
  });

  test("somaComWhile", () => {
    expect(somaComWhile(compras)).toBe(result);
  });

  test("somaComForEach", () => {
    expect(somaComForEach(compras)).toBe(result);
  });

  test("somaComReduce", () => {
    expect(somaComReduce(compras)).toBe(result);
  });

  test("somaComFlatMapEReduce", () => {
    expect(somaComFlatMapEReduce(compras)).toBe(result);
  });

  test("somaComSum", () => {
    expect(somaComSum(compras)).toBe(result);
  });

  test("somaComSumEFlatMap", () => {
    expect(somaComSumEFlatMap(compras)).toBe(result);
  });
});
```

## Somando com laços

Agora que já temos os tipos definidos, podemos começar a resolver o desafio. Podemos fazer isso de quatro formas:

### 1. Usando `for`

O [`for`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for) é um **laço de repetição** que executa um bloco de código até que uma condição seja satisfeita.

```typescript
function somaComFor(compras: Compra[]): number {
  let soma = 0;

  for (let i = 0; i < compras.length; i++) {
    for (let j = 0; j < compras[i].produtos.length; j++) {
      soma +=
        compras[i].produtos[j].qtd * compras[i].produtos[j].valor_unitario;
    }
  }

  return soma;
}
```

### 2. Usando `for...of`

O [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) é um **laço de iteração** que itera sobre uma sequência de valores vindos de um [objeto iterável](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) (que, no nosso caso, é um [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)).

```typescript
function somaComForOf(compras: Compra[]): number {
  let soma = 0;

  for (const compra of compras) {
    for (const produto of compra.produtos) {
      soma += produto.qtd * produto.valor_unitario;
    }
  }

  return soma;
}
```

### 3. Usando `for...in`

O [`for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) é um **laço de iteração** que itera sobre as propriedades enumeráveis do tipo _string_ de um objeto, inclusive as herdadas. Estou colocando esta solução aqui somente para mostrar que ela é possível, mas deve ser preterida em relação às outras soluções apresentadas neste artigo.

```typescript
function somaComForIn(compras: Compra[]): number {
  let soma = 0;

  for (const i in compras) {
    for (const j in compras[i].produtos) {
      soma +=
        compras[i].produtos[j].qtd * compras[i].produtos[j].valor_unitario;
    }
  }

  return soma;
}
```

### 4. Usando `while`

O [`while`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while) é um **laço de repetição** que executa um bloco de código até que uma condição seja satisfeita.

```typescript
function somaComWhile(compras: Compra[]): number {
  let soma = 0;

  let i = 0;
  while (i < compras.length) {
    let j = 0;
    while (j < compras[i].produtos.length) {
      soma +=
        compras[i].produtos[j].qtd * compras[i].produtos[j].valor_unitario;
      j++;
    }
    i++;
  }

  return soma;
}
```

## Somando com métodos de `Array`

### 1. Usando `Array.prototype.forEach`

O [`Array.prototype.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) é um método que executa uma função para cada elemento do array.

```typescript
function somaComForEach(compras: Compra[]): number {
  let soma = 0;

  compras.forEach((compra) => {
    compra.produtos.forEach((produto) => {
      soma += produto.qtd * produto.valor_unitario;
    });
  });

  return soma;
}
```

### 2. Usando `Array.prototype.reduce`

O [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) é um método que executa uma função para cada elemento do array, retornando um único valor.

```typescript
function somaComReduce(compras: Compra[]): number {
  return compras.reduce((soma, compra) => {
    return (
      soma +
      compra.produtos.reduce((soma, produto) => {
        return soma + produto.qtd * produto.valor_unitario;
      }, 0)
    );
  }, 0);
}
```

Mas, podemos torná-la ainda melhor usando o [`Array.prototype.flatMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap):

```typescript
function somaComFlatMapEReduce(compras: Compra[]): number {
  return compras
    .flatMap((compra) => compra.produtos)
    .reduce((soma, produto) => soma + produto.qtd * produto.valor_unitario, 0);
}
```

## Com uma função de ajuda

Podemos criar uma função genérica que faz a soma de qualquer array da seguinte forma:

```typescript
/**
 * Soma todos os valores de um array. Se o array for de objetos, é possível
 * passar uma função para extrair os números que serão somados.
 *
 * @example soma([1, 2, 3]) // 6
 * @example soma([{ valor: 1 }, { valor: 2 }, { valor: 3 }], item => item.valor) // 6
 */
function sum<T extends number | object>(
  array: T[],
  fn?: (item: T) => number
): number {
  return array.reduce(
    (acumulador, item) => acumulador + (fn ? fn(item) : (item as number)),
    0
  );
}
```

E usá-la em conjunto com as soluções já apresentadas:

```typescript
function somaComSumEFlatMap(compras: Compra[]): number {
  return sum(
    compras.flatMap((compra) => compra.produtos),
    (produto) => produto.qtd * produto.valor_unitario
  );
}
```

Se tiver alguma sugestão ou alguma outra ideia de como resolver este desafio, conta para mim nos comentários.
