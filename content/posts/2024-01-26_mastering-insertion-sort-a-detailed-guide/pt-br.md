---
title: "Dominando o algoritmo de ordenação por inserção: um guia detalhado"
slug: dominando-o-algoritmo-de-ordenacao-por-insercao-um-guia-detalhado
locale: pt-BR
created: 2024-01-26 23:00:25.261Z
updated: 2024-01-26 23:07:02.602Z
tags:
  - Algoritmos
  - Ciência da Computação
  - tutorial
cover: ./cover.jpg
type: post
---

Ordenação é uma operação fundamental no campo da ciência da computação e, por conta disso, existem vários algoritmos disponíveis para resolver este problema, cada um com sua aplicação determinada pela quantidade de itens a ordenar, o grau de ordenação já presente, a arquitetura do computador onde o algoritmo será executado, tipo de dispositivo de armazenamento, entre outros fatores. Neste artigo, exploraremos o algoritmo de ordenação por inserção, entendendo suas nuances, forças e limitações.

## O que é ordenação por inserção?

Ordenação por inserção é um algoritmo baseado em comparação que constrói a sua saída um elemento por vez. Ele funciona de maneira análoga ao método que utilizamos para ordenar as cartas de um baralho: pegamos uma carta de cada vez, comparamos com os anteriores que já estão na nossa mão, colocamos a carta na posição correta e, repetimos esta ação até o fim do nosso baralho.

É um algoritmo adaptativo, o que significa que é eficiente para pequenos conjuntos de dados, assim como outros algoritmos de complexidade quadrática ($O(n^2)$). É simples de implementar, requer um valor constante de memória, pois as alterações na lista são feitas na própria lista (sem a necessidade de criar uma nova lista, o que dobraria o uso da memória) e é capaz de ordenar a lista enquanto a recebe.

## Como a ordenação por inserção funciona?

1.  **Inicialização**: Assumimos que o primeiro elemento da nossa lista já está ordenado. Prosseguimos para o próximo elemento, consideramos ele como nossa chave e o inserimos na posição correta na parte ordenada da lista;
2.  **Iteração**: Para cada item da lista (começando do segundo elemento), armazenamos o item atual (chave) e sua posição. Comparamos então a chave com os elementos na parte ordenada da lista (elementos antes da chave);
3.  **Inserção**: Se o elemento atual na parte ordenada for maior que a chave, movemos esse elemento uma posição acima. Isso cria espaço para a nova chave ser inserida;
4.  **Reposicionamento da Chave**: Continuamos movendo elementos uma posição acima até encontrarmos a posição correta para a chave. Esta posição é encontrada quando batemos em um elemento menor ou igual à chave ou alcançamos o início da lista.
5.  **Repetir**: O processo é repetido para todos os elementos da lista.

## Implementação em JavaScript

Para melhor entendermos o algoritmo, vamos implementá-lo em JavaScript:

```js
/**
 * Ordena um array de números usando o algoritmo de ordenação por inserção.
 *
 * @param  {number[]}  numbers - A lista de números que deve ser ordenada.
 * @returns  {number[]} - A lista de números ordenada.
 */
function insertionSort(numbers) {
  for (let i = 1; i < numbers.length; i++) {
    const key = numbers[i];
    let j = i - 1;

    while (j >= 0 && numbers[j] > key) {
      numbers[j + 1] = numbers[j];
      j--;
    }

    numbers[j + 1] = key;
  }
}
```

## Análise da complexidade

### Complexidade de tempo

- **Melhor caso (Array já está ordenado)**: $O(n)$. Isso porque o laço interno (`while`) não é executado nenhuma vez;
- **Caso médio e pior caso (Array está ordenado de maneira reversa)**: $O(n^2)$. No pior caso, cada iteração fará com que um elemento seja movido. Isso faz este algoritmo ser ineficiente para conjuntos grandes de dados.

### Complexidade de espaço

- **Complexidade de espaço**: $O(1)$. ordenação por inserção é um algoritmo _in-place_; requer um valor constante de espaço na memória.
