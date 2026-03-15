---
title: Introdução à algoritmos
slug: introducao-a-algoritmos
locale: pt-BR
created: 2024-01-25 16:53:40.103Z
updated: 2024-01-25 17:00:20.007Z
tags:
  - Iniciantes
  - Algoritmos
  - Ciência da Computação
cover: ./cover.jpg
type: post
---

## O que é um algoritmo?

Um _algoritmo_ é uma especificação precisa e sem ambiguidades de uma sequência de passos computacionais que podem ser realizados mecanicamente[^1]. A partir disso, podemos pensar em uma função que recebe um valor ou um conjunto de valores de **entrada** e retorna um valor ou conjunto de valores em sua **saída**.

Um algoritmo pode ser **correto** e **incorreto**. Ele é correto quando, dados seus parâmetros de entrada, sua saída for correta e, portanto, **resolve** o problema computacional para qual foi desenvolvido. Um algoritmo incorreto, por sua vez, pode parar com uma saída incorreta ou mesmo não parar para algumas instâncias de entrada. Ainda assim, alguns algoritmos incorretos ainda podem ter aplicações úteis.

Podem haver diferentes algoritmos que resolvem um mesmo problema, alguns mais eficientes, isto é, mais velozes do que outros. Mas, nem todo problema possui uma solução eficiente. Tais problemas são conhecidos como <abbr title="Tempo polinomial não-determinístico">NP</abbr>-completos.

Problemas <abbr title="Tempo polinomial não-determinístico">NP</abbr>-completos são muito interessantes: mesmo que nenhum algoritmo eficiente tenha sido encontrado para esta classe de problemas, não se provou que que não é possível encontrar um algoritmo eficiente (da classe P, que pode ser resolvido em tempo polinomial) para tal problema. Além disso, se houver um algoritmo eficiente para resolver um problema NP-completo, significa que existe um algoritmo eficiente para todos os problemas <abbr title="tempo polinomial não-determinístico">NP</abbr>-completos.

<Alert title="P vs. NP">
P vs. NP é uma questão fundamental em ciência da computação, especificamente no campo da teoria da complexidade computacional. Ela diz respeito à relação entre duas classes de problemas. A classe P consiste em problemas de decisão (problemas com resposta sim ou não) que podem ser resolvidos rapidamente (em tempo polinomial) por um computador determinístico, o que significa que o tempo necessário para resolver o problema cresce a uma taxa gerenciável à medida que o tamanho da entrada aumenta. Por outro lado, a classe NP consiste em problemas de decisão para os quais, se uma solução for fornecida, ela pode ser verificada rapidamente (também em tempo polinomial) por um computador determinístico.

A questão crucial, "P é igual a NP?", pergunta se todo problema cuja solução pode ser verificada rapidamente (NP) também pode ser resolvido rapidamente (P). Isso é profundo porque, se P fosse igual a NP, significaria que todos os problemas que podemos verificar rapidamente também podem ser resolvidos rapidamente. Isso tem implicações vastas para vários campos, incluindo criptografia, otimização e design de algoritmos.
</Alert>

## Complexidade de algoritmos

Quando falamos de algoritmos, na maior parte do tempo estamos interessados na taxa de crescimento de tempo e espaço requeridos para resolver instâncias cada vez maiores de determinados problemas. Se estamos interessados no tempo que determinado algoritmo leva para executar sua função, estamos interessados um sua _complexidade temporal_. E o comportamento do limite da complexidade temporal do nosso algoritmo em relação ao aumento das instâncias do problema é chamado de _complexidade assintótica temporal_. E é esse complexidade assintótica que que determina o tamanho do problema que pode ser resolvido por algoritmos[^2].

Se um algoritmo leva um tempo $cn^2$ para uma constante $c$ para processar um entrada de tamanho $n$, dizemos que a complexidade do algoritmo é da _ordem de $n^2$_, ou, em notação Bachmann–Landau (também chamada de notação assintótica e notação **Big O**), o algoritmo tem a complexidade $O(n^2)$.

Para termos uma melhor ideia do que isso significa em relação ao tempo de execução do nosso algoritmo, considere que uma unidade de tempo no computador em que executamos o nosso algoritmo é de 1 milissegundo. Agora, queremos saber qual o tamanho máximo da entrada que o nosso algoritmo pode processar dentro de um determinado limite de tempo (um segundo, um hora e um dia). Observe, na tabela abaixo, o quanto a complexidade do algoritmo interfere no tamanho máximo da entrada que ele pode tratar, dado o limite de tempo:

| Complexidade de tempo | 1 segundo | 1 minuto | 1 hora |
| --------------------- | --------- | -------- | ------ |
| $n$                   | 1000      | 60000    | 360000 |
| $n \log_2 n$          | 140       | 4895     | 204095 |
| $n^2$                 | 31        | 244      | 1897   |
| $n^3$                 | 10        | 39       | 153    |
| $2^n$                 | 9         | 15       | 21     |

Ainda que possamos construir computadores mais rápidos, o aumento na velocidade de execução dos algoritmos menos eficientes não seria tão significativo, de modo que que devemos buscar sempre o algoritmo de melhor eficiência para tratar determinado problema.

[^1]: AHO, Alfred V.; ULLMAN, Jeffrey D. _Foundations of Computer Science_. Stanford, 1994.

[^2]: AHO, Alfred V.; HOPCROFT, John E.; ULLMAN, Jeffrey D. _The Design and Analysis of Computer Algorithms_. Addison-Wesley, 1974.
